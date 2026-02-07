#!/usr/bin/env node
import fs from 'node:fs/promises';

import type { DocumentOptions } from '../src/lib/exportDocx';
import { htmlToDocxBlob } from '../src/lib/exportDocx';

export type HtmlToDocxOptions = {
  input: string;
  landscape?: boolean;
  output?: string;
};

/** Convert an HTML string to a DOCX Blob using the html-to-docx converter. */
export async function convertHtmlToDocx(
  html: string,
  options: DocumentOptions = {}
): Promise<Blob> {
  return htmlToDocxBlob(html, options);
}

async function htmlToDocx(options: HtmlToDocxOptions) {
  const html = await fs.readFile(options.input, 'utf-8');

  const docxOptions: DocumentOptions = {};

  if (options.landscape) {
    docxOptions.orientation = 'landscape';
  }

  const blob = await convertHtmlToDocx(html, docxOptions);
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (options.output) {
    await fs.writeFile(options.output, buffer);
  } else {
    process.stdout.write(buffer);
  }

  return blob;
}

// Only run CLI when executed directly (not when imported for testing)
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('html-to-docx.ts')
) {
  const args = process.argv.slice(2);
  const options: HtmlToDocxOptions = { input: '' };

  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg === '--input' || arg === '-i') {
      options.input = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--landscape') {
      options.landscape = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: html-to-docx [options]

Options:
  -i, --input <file>           Input HTML file (required)
  -o, --output <file>          Output DOCX file (writes to stdout if omitted)
  --landscape                  Use landscape orientation
  -h, --help                   Show help
      `);
      process.exit(0);
    }
    i++;
  }

  if (!options.input) {
    console.error('Error: --input is required');
    process.exit(1);
  }

  htmlToDocx(options).catch((err: Error) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
