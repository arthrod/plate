#!/usr/bin/env node
import fs from 'node:fs/promises';

import { JSDOM } from 'jsdom';
import type { TNode } from 'platejs';

import { createCLIEditor } from './shared/editor-config';

export type HtmlToPlateOptions = {
  input: string;
  collapseWhiteSpace?: boolean;
  output?: string;
  pretty?: boolean;
};

/** Convert an HTML string to Plate JSON nodes using production plugins. */
export function convertHtmlToPlate(
  html: string,
  collapseWhiteSpace = true
): TNode[] {
  const dom = new JSDOM(html);
  const element = dom.window.document.body;
  const editor = createCLIEditor();

  return editor.api.html.deserialize({
    collapseWhiteSpace,
    element,
  }) as TNode[];
}

async function htmlToPlate(options: HtmlToPlateOptions) {
  const html = await fs.readFile(options.input, 'utf-8');
  const nodes = convertHtmlToPlate(html, options.collapseWhiteSpace ?? true);

  const json = options.pretty
    ? JSON.stringify(nodes, null, 2)
    : JSON.stringify(nodes);

  if (options.output) {
    await fs.writeFile(options.output, json, 'utf-8');
  } else {
  }

  return nodes;
}

// Only run CLI when executed directly (not when imported for testing)
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('html-to-plate.ts')
) {
  const args = process.argv.slice(2);
  const options: HtmlToPlateOptions = {
    input: '',
    collapseWhiteSpace: true,
  };

  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg === '--input' || arg === '-i') {
      options.input = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--pretty' || arg === '-p') {
      options.pretty = true;
    } else if (arg === '--preserve-whitespace') {
      options.collapseWhiteSpace = false;
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

  htmlToPlate(options).catch((err: Error) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
