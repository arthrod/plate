#!/usr/bin/env node
import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import { createCLIEditor } from './shared/editor-config';

interface Options {
  input: string;
  output?: string;
  pretty?: boolean;
  collapseWhiteSpace?: boolean;
}

async function htmlToPlate(options: Options) {
  console.log('🐰 Converting HTML to Plate...');

  // Read HTML file
  const html = await fs.readFile(options.input, 'utf-8');
  console.log(`📖 Read ${options.input}`);

  // Parse HTML
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const element = document.body;

  // Create editor with production plugins
  const editor = createCLIEditor();

  // Deserialize using production logic
  // @ts-ignore - API exists but type checking might complain depending on imports
  const nodes = editor.api.html.deserialize({
    element,
    collapseWhiteSpace: options.collapseWhiteSpace ?? true,
  });

  // Format output
  const json = options.pretty
    ? JSON.stringify(nodes, null, 2)
    : JSON.stringify(nodes);

  // Write or print
  if (options.output) {
    await fs.writeFile(options.output, json, 'utf-8');
    console.log(`✅ Wrote ${options.output}`);
  } else {
    console.log(json);
  }

  return nodes;
}

// CLI argument parsing
const args = process.argv.slice(2);
const options: Options = {
  input: '',
  collapseWhiteSpace: true,
};

for (let i = 0; i < args.length; i++) {
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
    console.log(`
Usage: html-to-plate [options]

Options:
  -i, --input <file>           Input HTML file (required)
  -o, --output <file>          Output JSON file (prints to stdout if omitted)
  -p, --pretty                 Pretty-print JSON
  --preserve-whitespace        Don't collapse whitespace
  -h, --help                   Show help

Example:
  html-to-plate -i input.html -o output.json --pretty
    `);
    process.exit(0);
  }
}

if (!options.input) {
  console.error('❌ Error: --input is required');
  console.error('Run with --help for usage');
  process.exit(1);
}

htmlToPlate(options).catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
