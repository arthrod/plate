#!/usr/bin/env node
import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import { createCLIEditor, createStaticCLIEditor } from './shared/editor-config';
import { diff } from 'jest-diff';

interface ValidationResult {
  success: boolean;
  originalHtml: string;
  plateJson: any;
  regeneratedHtml: string;
  differences?: string;
  errors: string[];
}

interface Options {
  input: string;
  output?: string;
  verbose?: boolean;
  failOnDiff?: boolean;
}

async function validateRoundtrip(options: Options): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: true,
    originalHtml: '',
    plateJson: null,
    regeneratedHtml: '',
    errors: [],
  };

  try {
    console.log('🐰 Starting round-trip validation...\n');

    // Step 1: Read original HTML
    result.originalHtml = await fs.readFile(options.input, 'utf-8');
    console.log('✅ Step 1: Read original HTML');
    if (options.verbose) {
      console.log(`   Length: ${result.originalHtml.length} chars`);
    }

    // Step 2: HTML → Plate
    const dom = new JSDOM(result.originalHtml);
    const editor = createCLIEditor();
    // @ts-ignore
    result.plateJson = editor.api.html.deserialize({
      element: dom.window.document.body,
      collapseWhiteSpace: true,
    });
    console.log('✅ Step 2: Converted HTML → Plate');
    if (options.verbose) {
      console.log(`   Nodes: ${result.plateJson.length}`);
      console.log(`   JSON:\n${JSON.stringify(result.plateJson, null, 2)}\n`);
    }

    // Step 3: Plate → HTML
    const staticEditor = createStaticCLIEditor();
    staticEditor.children = result.plateJson;
    const { serializeHtml } = await import('platejs/static');
    // @ts-ignore
    result.regeneratedHtml = await serializeHtml(staticEditor, {
      stripClassNames: false,
      stripDataAttributes: false,
    });
    console.log('✅ Step 3: Converted Plate → HTML');
    if (options.verbose) {
      console.log(`   Length: ${result.regeneratedHtml.length} chars\n`);
    }

    // Step 4: Compare HTML (normalize whitespace)
    const normalizeHtml = (html: string) => {
      const dom = new JSDOM(html);
      return dom.window.document.body.innerHTML
        .replace(/\s+/g, ' ')
        .trim();
    };

    const normalizedOriginal = normalizeHtml(result.originalHtml);
    const normalizedRegenerated = normalizeHtml(result.regeneratedHtml);

    if (normalizedOriginal !== normalizedRegenerated) {
      result.success = false;
      result.differences = diff(normalizedOriginal, normalizedRegenerated, {
        contextLines: 3,
        expand: false,
      }) || 'No diff output';

      console.log('❌ Step 4: HTML comparison FAILED\n');
      console.log('Differences:');
      console.log(result.differences);

      result.errors.push('Round-trip HTML does not match original');
    } else {
      console.log('✅ Step 4: HTML comparison PASSED');
    }

    // Step 5: Validate specific fields (paraId, parentParaId, reply IDs, etc.)
    console.log('\n🔍 Step 5: Validating field preservation...');

    const validateFields = (nodes: any[], path = 'root'): void => {
      nodes.forEach((node, idx) => {
        const nodePath = `${path}[${idx}]`;

        // Check for discussion/comment fields
        if (node.type === 'discussion' || node.type === 'comment') {
          // Check if paraId would be lost in export
          if (node.paraId) {
            console.log(`   ⚠️  Found paraId at ${nodePath} (check if exported)`);
          }
          if (node.parentParaId) {
            console.log(`   ⚠️  Found parentParaId at ${nodePath} (check if exported)`);
          }

          // Check replies
          if (node.replies) {
            node.replies.forEach((reply: any, rIdx: number) => {
              if (!reply.id) {
                result.errors.push(`Missing reply.id at ${nodePath}.replies[${rIdx}]`);
                result.success = false;
                console.log(`   ❌ Missing reply.id at ${nodePath}.replies[${rIdx}]`);
              } else {
                console.log(`   ✅ Reply.id present at ${nodePath}.replies[${rIdx}]: ${reply.id}`);
              }
            });
          }
        }

        // Recurse into children
        if (node.children) {
          validateFields(node.children, nodePath);
        }
      });
    };

    validateFields(result.plateJson);

    // Summary
    console.log('\n' + '='.repeat(60));
    if (result.success) {
      console.log('✅ VALIDATION PASSED');
    } else {
      console.log('❌ VALIDATION FAILED');
      console.log(`   Errors: ${result.errors.length}`);
      result.errors.forEach(err => console.log(`   - ${err}`));
    }
    console.log('='.repeat(60));

  } catch (error: any) {
    result.success = false;
    result.errors.push(error.message);
    console.error('\n❌ Validation error:', error.message);
  }

  // Write report
  if (options.output) {
    await fs.writeFile(
      options.output,
      JSON.stringify(result, null, 2),
      'utf-8'
    );
    console.log(`\n📄 Report written to ${options.output}`);
  }

  return result;
}

// CLI argument parsing
const args = process.argv.slice(2);
const options: Options = {
  input: '',
  verbose: false,
  failOnDiff: false,
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--input' || arg === '-i') {
    options.input = args[++i];
  } else if (arg === '--output' || arg === '-o') {
    options.output = args[++i];
  } else if (arg === '--verbose' || arg === '-v') {
    options.verbose = true;
  } else if (arg === '--fail-on-diff') {
    options.failOnDiff = true;
  } else if (arg === '--help' || arg === '-h') {
    console.log(`
Usage: validate-roundtrip [options]

Validates HTML → Plate → HTML round-trip fidelity.

Options:
  -i, --input <file>           Input HTML file (required)
  -o, --output <file>          Output JSON report
  -v, --verbose                Show detailed output
  --fail-on-diff               Exit with code 1 if differences found
  -h, --help                   Show help

Example:
  validate-roundtrip -i sample.html -o report.json --verbose
    `);
    process.exit(0);
  }
}

if (!options.input) {
  console.error('❌ Error: --input is required');
  process.exit(1);
}

validateRoundtrip(options).then((result) => {
  if (options.failOnDiff && !result.success) {
    process.exit(1);
  }
}).catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
