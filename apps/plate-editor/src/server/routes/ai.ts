import { Hono } from 'hono';
import {
  type LanguageModel,
  type UIMessageStreamWriter,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  Output,
  streamText,
  tool,
} from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import { type SlateEditor, createSlateEditor, nanoid } from 'platejs';
import { z } from 'zod';

import { markdownJoinerTransform } from '../../client/lib/markdown-joiner-transform';
import {
  buildEditTableMultiCellPrompt,
  getChooseToolPrompt,
  getCommentPrompt,
  getEditPrompt,
  getGeneratePrompt,
} from '../ai/index';

export const aiRoutes = new Hono();

// AI command route (replaces Next.js POST /api/ai/command)
aiRoutes.post('/command', async (c) => {
  const { apiKey: key, ctx, messages: messagesRaw, model } = await c.req.json();
  const { children, selection, toolName: toolNameParam } = ctx;

  const editor = createSlateEditor({
    selection,
    value: children,
  });

  const apiKey = key || process.env.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return c.json({ error: 'Missing AI Gateway API key.' }, 401);
  }

  const isSelecting = editor.api.isExpanded();
  const gatewayProvider = createGateway({ apiKey });

  try {
    const stream = createUIMessageStream({
      execute: async ({ writer }: { writer: UIMessageStreamWriter }) => {
        let toolName = toolNameParam;

        if (!toolName) {
          const prompt = getChooseToolPrompt({
            isSelecting,
            messages: messagesRaw,
          });

          const enumOptions = isSelecting
            ? ['generate', 'edit', 'comment']
            : ['generate', 'comment'];
          const modelId = model || 'google/gemini-2.5-flash';

          const { output: AIToolName } = await generateText({
            model: gatewayProvider(modelId),
            output: Output.choice({ options: enumOptions }),
            prompt,
          });

          writer.write({
            data: AIToolName,
            type: 'data-toolName',
          });

          toolName = AIToolName;
        }

        const textStream = streamText({
          experimental_transform: markdownJoinerTransform(),
          model: gatewayProvider(model || 'openai/gpt-4o-mini'),
          prompt: '',
          tools: {
            comment: getCommentTool(editor, {
              messagesRaw,
              model: gatewayProvider(model || 'google/gemini-2.5-flash'),
              writer,
            }),
            table: getTableTool(editor, {
              messagesRaw,
              model: gatewayProvider(model || 'google/gemini-2.5-flash'),
              writer,
            }),
          },
          prepareStep: async (step: any) => {
            if (toolName === 'comment') {
              return { ...step, toolChoice: { toolName: 'comment', type: 'tool' } };
            }
            if (toolName === 'edit') {
              const [editPrompt, editType] = getEditPrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });
              if (editType === 'table') {
                return { ...step, toolChoice: { toolName: 'table', type: 'tool' } };
              }
              return {
                ...step,
                activeTools: [],
                model: editType === 'selection'
                  ? gatewayProvider(model || 'google/gemini-2.5-flash')
                  : gatewayProvider(model || 'openai/gpt-4o-mini'),
                messages: [{ content: editPrompt, role: 'user' }],
              };
            }
            if (toolName === 'generate') {
              const generatePrompt = getGeneratePrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });
              return {
                ...step,
                activeTools: [],
                messages: [{ content: generatePrompt, role: 'user' }],
                model: gatewayProvider(model || 'openai/gpt-4o-mini'),
              };
            }
          },
        });

        writer.merge(textStream.toUIMessageStream({ sendFinish: false }));
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch {
    return c.json({ error: 'Failed to process AI request' }, 500);
  }
});

// Copilot route (replaces Next.js POST /api/ai/copilot)
aiRoutes.post('/copilot', async (c) => {
  const { apiKey: key, model = 'gpt-4o-mini', prompt, system } = await c.req.json();

  const apiKey = key || process.env.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return c.json({ error: 'Missing AI Gateway API key.' }, 401);
  }

  try {
    const result = await generateText({
      abortSignal: c.req.raw.signal,
      maxOutputTokens: 50,
      model: `openai/${model}`,
      prompt,
      system,
      temperature: 0.7,
    });

    return c.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return c.json(null, 408);
    }
    return c.json({ error: 'Failed to process AI request' }, 500);
  }
});

// Helper tools (same logic as original)
const getCommentTool = (
  editor: SlateEditor,
  { messagesRaw, model, writer }: { messagesRaw: any[]; model: LanguageModel; writer: UIMessageStreamWriter }
) =>
  tool({
    description: 'Comment on the content',
    inputSchema: z.object({}),
    strict: true,
    execute: async () => {
      const commentSchema = z.object({
        blockId: z.string().describe('The id of the starting block.'),
        comment: z.string().describe('A brief comment or explanation for this fragment.'),
        content: z.string().describe('The original document fragment to be commented on.'),
      });

      const { partialOutputStream } = streamText({
        model,
        output: Output.array({ element: commentSchema }),
        prompt: getCommentPrompt(editor, { messages: messagesRaw }),
      });

      let lastLength = 0;
      for await (const partialArray of partialOutputStream) {
        for (let i = lastLength; i < partialArray.length; i++) {
          writer.write({ id: nanoid(), data: { comment: partialArray[i], status: 'streaming' }, type: 'data-comment' });
        }
        lastLength = partialArray.length;
      }
      writer.write({ id: nanoid(), data: { comment: null, status: 'finished' }, type: 'data-comment' });
    },
  });

const getTableTool = (
  editor: SlateEditor,
  { messagesRaw, model, writer }: { messagesRaw: any[]; model: LanguageModel; writer: UIMessageStreamWriter }
) =>
  tool({
    description: 'Edit table cells',
    inputSchema: z.object({}),
    strict: true,
    execute: async () => {
      const cellUpdateSchema = z.object({
        content: z.string().describe('The new content for the cell.'),
        id: z.string().describe('The id of the table cell to update.'),
      });

      const { partialOutputStream } = streamText({
        model,
        output: Output.array({ element: cellUpdateSchema }),
        prompt: buildEditTableMultiCellPrompt(editor, messagesRaw),
      });

      let lastLength = 0;
      for await (const partialArray of partialOutputStream) {
        for (let i = lastLength; i < partialArray.length; i++) {
          writer.write({ id: nanoid(), data: { cellUpdate: partialArray[i], status: 'streaming' }, type: 'data-table' });
        }
        lastLength = partialArray.length;
      }
      writer.write({ id: nanoid(), data: { cellUpdate: null, status: 'finished' }, type: 'data-table' });
    },
  });
