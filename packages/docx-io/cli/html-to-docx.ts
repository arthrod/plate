import fs from 'fs';
import path from 'path';
import { ArgumentParser } from 'argparse';
import { createSlateEditor } from 'platejs';
import { exportToDocx } from '../src/index.ts';
import { BaseEditorKit } from './config/editor-base-kit';
import { DocxExportKit } from './config/docx-export-kit';

// Use JSDOM instead of xmldom to get a full browser-like environment
import { JSDOM } from 'jsdom';

const parser = new ArgumentParser({
  description: 'Convert HTML to DOCX',
});

parser.addArgument(['-i', '--input'], {
  help: 'Input HTML file',
  required: true,
});
parser.addArgument(['-o', '--output'], {
  help: 'Output DOCX file',
  required: true,
});
parser.addArgument(['--orientation'], {
  help: 'Orientation (portrait/landscape)',
  default: 'portrait',
});

const args = parser.parseArgs();

const run = async () => {
  try {
    const inputPath = path.resolve(args.input);
    const outputPath = path.resolve(args.output);

    if (!fs.existsSync(inputPath)) {
      console.error(`Input file not found: ${inputPath}`);
      process.exit(1);
    }

    const html = fs.readFileSync(inputPath, 'utf-8');

    // Polyfill DOM with JSDOM
    const dom = new JSDOM(html);
    global.document = dom.window.document as any;
    global.Node = dom.window.Node as any;
    global.DOMParser = dom.window.DOMParser as any;

    // Create editor with BaseEditorKit to support deserialization
    const editor = createSlateEditor({
      plugins: BaseEditorKit,
    });

    // Deserialize HTML to Slate Nodes
    const nodes = editor.api.html.deserialize({
      element: global.document.body,
    });

    if (!nodes || nodes.length === 0) {
      console.warn('Warning: Deserialized content is empty');
    }

    // Serialize to DOCX
    const blob = await exportToDocx(nodes, {
      editorPlugins: [...BaseEditorKit, ...DocxExportKit],
      orientation: args.orientation as any,
    });

    // Convert Blob to Buffer
    const buffer = Buffer.from(await blob.arrayBuffer());

    fs.writeFileSync(outputPath, buffer);
    console.log(`DOCX saved to ${outputPath}`);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
};

run();
