import fs from 'fs';
import path from 'path';
import { ArgumentParser } from 'argparse';
import { createSlateEditor } from 'platejs';
import { exportToDocx } from '../src/index.ts';
import { BaseEditorKit } from './config/editor-base-kit';
import { DocxExportKit } from './config/docx-export-kit';
import { DOMParser } from '@xmldom/xmldom';

// Polyfill DOMParser for Node.js environment
global.DOMParser = DOMParser as any;

const parser = new ArgumentParser({
  description: 'Convert HTML to DOCX'
});

parser.add_argument('-i', '--input', { help: 'Input HTML file', required: true });
parser.add_argument('-o', '--output', { help: 'Output DOCX file', required: true });
parser.add_argument('--orientation', { help: 'Orientation (portrait/landscape)', default: 'portrait' });

const args = parser.parse_args();

const run = async () => {
    try {
        const inputPath = path.resolve(args.input);
        const outputPath = path.resolve(args.output);

        if (!fs.existsSync(inputPath)) {
            console.error(`Input file not found: ${inputPath}`);
            process.exit(1);
        }

        const html = fs.readFileSync(inputPath, 'utf-8');

        // Create editor with BaseEditorKit to support deserialization
        const editor = createSlateEditor({
            plugins: BaseEditorKit,
        });

        // Parse HTML to DOM
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Deserialize HTML to Slate Nodes
        // editor.api.html.deserialize is available via HtmlPlugin which is core
        const nodes = editor.api.html.deserialize({ element: doc.body });

        if (!nodes || nodes.length === 0) {
             console.warn('Warning: Deserialized content is empty');
        }

        // Serialize to DOCX
        const blob = await exportToDocx(nodes, {
            editorPlugins: [...BaseEditorKit, ...DocxExportKit],
            orientation: args.orientation as any
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
