import fs from 'fs';
import path from 'path';
import { ArgumentParser } from 'argparse';
import { createSlateEditor } from 'platejs';
import { serializeHtml } from 'platejs/static';
import { importDocxWithTracking } from '../src/index.ts';
import { BaseEditorKit } from './config/editor-base-kit';
import { DOMParser } from '@xmldom/xmldom';

// Polyfill DOMParser for Node.js environment
global.DOMParser = DOMParser as any;

const parser = new ArgumentParser({
  description: 'Convert DOCX to HTML'
});

parser.add_argument('-i', '--input', { help: 'Input DOCX file', required: true });
parser.add_argument('-o', '--output', { help: 'Output HTML file', required: true });

const args = parser.parse_args();

const run = async () => {
    try {
        const inputPath = path.resolve(args.input);
        const outputPath = path.resolve(args.output);

        if (!fs.existsSync(inputPath)) {
            console.error(`Input file not found: ${inputPath}`);
            process.exit(1);
        }

        const buffer = fs.readFileSync(inputPath);
        // Convert Buffer to ArrayBuffer
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

        // Create editor
        const editor = createSlateEditor({
            plugins: BaseEditorKit,
        });

        // Import DOCX
        const result = await importDocxWithTracking(editor as any, arrayBuffer);

        if (result.errors.length > 0) {
            console.warn('Import warnings:', result.errors);
        }

        const nodes = editor.children;

        // Serialize Nodes to HTML
        const html = await serializeHtml(editor, {
            nodes,
        });

        fs.writeFileSync(outputPath, html);
        console.log(`HTML saved to ${outputPath}`);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
};

run();
