import type { NextRequest } from 'next/server';

import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    apiKey: key,
    model = 'gpt-4o-mini',
    prompt,
    system,
  } = z
    .object({
      apiKey: z.string().optional(),
      model: z.string().optional(),
      prompt: z.string(),
      system: z.string().optional(),
    })
    .parse(body);

  // To use a server-side API key, remove the 'key' parameter and use process.env.AI_GATEWAY_API_KEY directly.
  // Ensure you have authentication to prevent abuse.
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
