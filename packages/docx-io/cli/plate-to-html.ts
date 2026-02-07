#!/usr/bin/env node
import fs from 'node:fs/promises';

import type { Value } from 'platejs';

import { serializeHtml } from 'platejs/static';

import { createStaticCLIEditor } from './shared/editor-config';

export type PlateToHtmlOptions = {
  input: string;
  output?: string;
  preserveClassNames?: string[];
  stripClassNames?: boolean;
  stripDataAttributes?: boolean;
};

export type ConvertPlateToHtmlOptions = {
  preserveClassNames?: string[];
  stripClassNames?: boolean;
  stripDataAttributes?: boolean;
};

/** Convert Plate JSON nodes to HTML using production plugins. */
export async function convertPlateToHtml(
  nodes: Value,
  options: ConvertPlateToHtmlOptions = {}
): Promise<string> {
  const editor = createStaticCLIEditor();
  editor.children = nodes;

  return serializeHtml(editor, {
    preserveClassNames: options.preserveClassNames ?? [],
    stripClassNames: options.stripClassNames ?? false,
    stripDataAttributes: options.stripDataAttributes ?? false,
  });
}

async function plateToHtml(options: PlateToHtmlOptions) {
  const json = await fs.readFile(options.input, 'utf-8');
  const nodes = JSON.parse(json) as Value;

  const html = await convertPlateToHtml(nodes, {
    preserveClassNames: options.preserveClassNames,
    stripClassNames: options.stripClassNames,
    stripDataAttributes: options.stripDataAttributes,
  });

  if (options.output) {
    await fs.writeFile(options.output, html, 'utf-8');
  } else {
    console.log(html);
  }

  return html;
}

// Only run CLI when executed directly (not when imported for testing)
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('plate-to-html.ts')
) {
  const args = process.argv.slice(2);
  const options: PlateToHtmlOptions = {
    input: '',
  };

  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg === '--input' || arg === '-i') {
      options.input = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--strip-classes') {
      options.stripClassNames = true;
    } else if (arg === '--strip-data') {
      options.stripDataAttributes = true;
    } else if (arg === '--preserve-class') {
      if (!options.preserveClassNames) options.preserveClassNames = [];
      options.preserveClassNames.push(args[++i]);
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: plate-to-html [options]

Options:
  -i, --input <file>           Input Plate JSON file (required)
  -o, --output <file>          Output HTML file (prints to stdout if omitted)
  --strip-classes              Remove all CSS class names
  --strip-data                 Remove all data-* attributes
  --preserve-class <name>      Keep specific class name (can use multiple times)
  -h, --help                   Show help

Example:
  plate-to-html -i input.json -o output.html --strip-data
      `);
      process.exit(0);
    }
    i++;
  }

  if (!options.input) {
    console.error('Error: --input is required');
    console.error('Run with --help for usage');
    process.exit(1);
  }

  plateToHtml(options).catch((err: Error) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
