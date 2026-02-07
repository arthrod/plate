#!/usr/bin/env node
import fs from 'fs/promises';
import { createStaticCLIEditor } from './shared/editor-config';

interface Options {
  input: string;
  output?: string;
  stripClassNames?: boolean;
  stripDataAttributes?: boolean;
  preserveClassNames?: string[];
}

async function plateToHtml(options: Options) {
  console.log('🐰 Converting Plate to HTML...');

  // Read Plate JSON
  const json = await fs.readFile(options.input, 'utf-8');
  const nodes = JSON.parse(json);
  console.log(`📖 Read ${options.input}`);

  // Create static editor with production plugins
  const editor = createStaticCLIEditor();
  editor.children = nodes;

  // Serialize using production logic
  const { serializeHtml } = await import('platejs/static');
  // @ts-ignore
  const html = await serializeHtml(editor, {
    stripClassNames: options.stripClassNames ?? false,
    stripDataAttributes: options.stripDataAttributes ?? false,
    preserveClassNames: options.preserveClassNames ?? [],
  });

  // Write or print
  if (options.output) {
    await fs.writeFile(options.output, html, 'utf-8');
    console.log(`✅ Wrote ${options.output}`);
  } else {
    console.log(html);
  }

  return html;
}

// CLI argument parsing
const args = process.argv.slice(2);
const options: Options = {
  input: '',
};

for (let i = 0; i < args.length; i++) {
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
}

if (!options.input) {
  console.error('❌ Error: --input is required');
  console.error('Run with --help for usage');
  process.exit(1);
}

plateToHtml(options).catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
