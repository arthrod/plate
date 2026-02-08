#!/usr/bin/env node
import fs from 'node:fs/promises';

import { mammoth, preprocessMammothHtml } from '../src/lib/importDocx';

export type DocxToHtmlOptions = {
  input: string;
  output?: string;
  raw?: boolean;
};

export type ConvertDocxToHtmlResult = {
  html: string;
  warnings: string[];
};

/**
 * Convert a DOCX ArrayBuffer to HTML using the mammoth.js fork.
 * When raw is false (default), preprocesses the HTML to extract comment tokens.
 */
export async function convertDocxToHtml(
  arrayBuffer: ArrayBuffer,
  raw = false
): Promise<ConvertDocxToHtmlResult> {
  const mammothResult = await mammoth.convertToHtml(
    { arrayBuffer },
    { styleMap: ['comment-reference => sup'] }
  );

  const warnings = mammothResult.messages
    .filter((m) => m.type === 'warning')
    .map((m) => m.message);

  if (raw) {
    return { html: mammothResult.value, warnings };
  }

  const { html } = preprocessMammothHtml(mammothResult.value);

  return { html, warnings };
}

async function docxToHtml(options: DocxToHtmlOptions) {
  const fileBuffer = await fs.readFile(options.input);
  const arrayBuffer = fileBuffer.buffer.slice(
    fileBuffer.byteOffset,
    fileBuffer.byteOffset + fileBuffer.byteLength
  ) as ArrayBuffer;

  const result = await convertDocxToHtml(arrayBuffer, options.raw);

  if (options.output) {
    await fs.writeFile(options.output, result.html, 'utf-8');
  } else {
  }

  if (result.warnings.length > 0) {
    for (const warning of result.warnings) {
      console.error(`Warning: ${warning}`);
    }
  }

  return result;
}

// Only run CLI when executed directly (not when imported for testing)
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('docx-to-html.ts')
) {
  const args = process.argv.slice(2);
  const options: DocxToHtmlOptions = {
    input: '',
  };

  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg === '--input' || arg === '-i') {
      options.input = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--raw') {
      options.raw = true;
    } else if (arg === '--help' || arg === '-h') {
      process.exit(0);
    }
    i++;
  }

  if (!options.input) {
    console.error('Error: --input is required');
    console.error('Run with --help for usage');
    process.exit(1);
  }

  docxToHtml(options).catch((err: Error) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
