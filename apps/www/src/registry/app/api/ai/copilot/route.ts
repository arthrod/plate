import type { NextRequest } from 'next/server';

import { z } from 'zod';

import { generateText } from 'ai';
import { NextResponse } from 'next/server';

const toRequestSchema = z.object({
  apiKey: z.string().optional(),
  model: z.string().optional(),
  prompt: z.string(),
  system: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parseResult = toRequestSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { details: parseResult.error, error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const {
    apiKey: key,
    model = 'gpt-4o-mini',
    prompt,
    system,
  } = parseResult.data;

  const apiKey = key;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing ai gateway API key.' },
      { status: 401 }
    );
  }

  try {
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
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
