import { generateText } from 'ai';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {
    apiKey: key,
    model = 'gpt-4o-mini',
    prompt,
    system,
  } = await req.json();

  // To ensure security, we only use the environment variable in development.
  // In production, we expect the API key to be passed in the request body
  // or a custom authentication method to be implemented.
  const apiKey =
    key ||
    (process.env.NODE_ENV === 'development'
      ? process.env.AI_GATEWAY_API_KEY
      : undefined);

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing AI Gateway API key.' },
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
