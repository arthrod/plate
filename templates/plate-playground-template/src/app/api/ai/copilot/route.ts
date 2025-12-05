import { generateText } from 'ai';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const completionSchema = z.object({
  text: z.string().describe('The completion text suggestion'),
});

export async function POST(req: NextRequest) {
  const {
    apiKey: key,
    model = 'gpt-4o-mini',
    prompt,
    system,
  } = await req.json();

  const apiKey = key || process.env.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing ai gateway API key.' },
      { status: 401 }
    );
  }

  try {
    const result = await generateObject({
      abortSignal: req.signal,
      model: `openai/${model}`,
      prompt,
      schema: completionSchema,
      schemaDescription: 'A text completion suggestion for the editor',
      schemaName: 'completion',
      system,
      temperature: 0.7,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
