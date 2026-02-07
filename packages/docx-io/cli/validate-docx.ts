import fs from 'fs';
import path from 'path';
import { ArgumentParser } from 'argparse';
import { createSlateEditor } from 'platejs';
import { exportToDocx, importDocxWithTracking } from '../src/index.ts';
import { BaseEditorKit } from './config/editor-base-kit';
import { DocxExportKit } from './config/docx-export-kit';
import { DOMParser } from '@xmldom/xmldom';

// Polyfill DOMParser
global.DOMParser = DOMParser as any;

const parser = new ArgumentParser({
  description: 'Validate HTML <-> DOCX Round-trip'
});

parser.add_argument('-i', '--input', { help: 'Input HTML file', required: true });
parser.add_argument('--save-docs', { help: 'Save intermediate DOCX file', action: 'store_true' });
parser.add_argument('--fail-on-diff', { help: 'Exit with error if differences found', action: 'store_true' });
parser.add_argument('-o', '--output', { help: 'Output JSON report file (optional)' });

const args = parser.parse_args();

const run = async () => {
    try {
        const inputPath = path.resolve(args.input);

        if (!fs.existsSync(inputPath)) {
            console.error(`Input file not found: ${inputPath}`);
            process.exit(1);
        }

        console.log('Reading input HTML...');
        const html = fs.readFileSync(inputPath, 'utf-8');

        // 1. Deserialize HTML to Input Nodes
        console.log('Deserializing HTML...');
        const editor = createSlateEditor({
            plugins: BaseEditorKit,
        });

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const inputNodes = editor.api.html.deserialize({ element: doc.body });

        if (!inputNodes || inputNodes.length === 0) {
            console.warn('Warning: Input nodes are empty');
        }

        // 2. Export to DOCX
        console.log('Exporting to DOCX...');
        const blob = await exportToDocx(inputNodes, {
            editorPlugins: [...BaseEditorKit, ...DocxExportKit],
        });

        const arrayBuffer = await blob.arrayBuffer();

        if (args.save_docs) {
            const docxPath = inputPath.replace(/\.html?$/, '.docx');
            fs.writeFileSync(docxPath, Buffer.from(arrayBuffer));
            console.log(`Saved intermediate DOCX to ${docxPath}`);
        }

        // 3. Import DOCX to Output Nodes
        console.log('Importing from DOCX...');
        const importEditor = createSlateEditor({
            plugins: BaseEditorKit,
        });

        const importResult = await importDocxWithTracking(importEditor as any, arrayBuffer);
        const outputNodes = importEditor.children;

        // 4. Compare
        console.log('Comparing nodes...');
        const inputJson = JSON.stringify(inputNodes, null, 2);
        const outputJson = JSON.stringify(outputNodes, null, 2);

        const isEqual = inputJson === outputJson;

        const report = {
            inputPath,
            isEqual,
            inputNodesCount: inputNodes.length,
            outputNodesCount: outputNodes.length,
            diff: isEqual ? null : 'Nodes differ (check output JSON for details)',
            importStats: {
                insertions: importResult.insertions,
                deletions: importResult.deletions,
                comments: importResult.comments,
                errors: importResult.errors,
            }
        };

        console.log('Validation Result:', isEqual ? 'PASS' : 'FAIL');

        if (args.output) {
            const outputPath = path.resolve(args.output);
            fs.writeFileSync(outputPath, JSON.stringify({ report, inputNodes, outputNodes }, null, 2));
            console.log(`Report saved to ${outputPath}`);
        } else if (!isEqual) {
            // Write to a temp file if no output specified
            const diffPath = inputPath + '.diff.json';
            fs.writeFileSync(diffPath, JSON.stringify({ inputNodes, outputNodes }, null, 2));
            console.log(`Diff saved to ${diffPath}`);
        }

        if (args.fail_on_diff && !isEqual) {
            process.exit(1);
        }

    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
};

run();
