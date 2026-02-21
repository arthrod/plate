import type { NextRequest } from 'next/server';

import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CopilotRequestSchema = z.object({
  apiKey: z.string().optional(),
  model: z.string().optional(),
  prompt: z.string(),
  system: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const {
      apiKey: key,
      model = 'gpt-4o-mini',
      prompt,
      system,
    } = CopilotRequestSchema.parse(json);

    const apiKey = key || process.env.AI_GATEWAY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing ai gateway API key.' },
        { status: 401 }
      );
    }

    const result = await generateText({
      abortSignal: req.signal,
      maxOutputTokens: 50,
      model: `openai/${model}`,
      prompt,
      system,
      temperature: 0.7,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
