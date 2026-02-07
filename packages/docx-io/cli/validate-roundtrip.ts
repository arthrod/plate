#!/usr/bin/env node
import fs from 'node:fs/promises';

import { diff } from 'jest-diff';
import type { TNode } from 'platejs';

import { convertHtmlToPlate } from './html-to-plate';
import { convertPlateToHtml } from './plate-to-html';
import { normalizeHtml, validateFields } from './shared/validation-utils';

export type ValidationResult = {
  success: boolean;
  differences?: string;
  errors: string[];
  originalHtml: string;
  plateJson: TNode[];
  regeneratedHtml: string;
};

export type ValidateRoundtripOptions = {
  input: string;
  failOnDiff?: boolean;
  output?: string;
  verbose?: boolean;
};

// Re-export for backwards compatibility
export { normalizeHtml, validateFields } from './shared/validation-utils';

/** Run round-trip validation: HTML -> Plate -> HTML. */
export async function runValidation(html: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    errors: [],
    originalHtml: html,
    plateJson: [],
    regeneratedHtml: '',
    success: true,
  };

  // Step 1: HTML -> Plate
  result.plateJson = convertHtmlToPlate(html);

  // Step 2: Plate -> HTML
  result.regeneratedHtml = await convertPlateToHtml(result.plateJson);

  // Step 3: Compare normalized HTML
  const normalizedOriginal = normalizeHtml(result.originalHtml);
  const normalizedRegenerated = normalizeHtml(result.regeneratedHtml);

  if (normalizedOriginal !== normalizedRegenerated) {
    result.success = false;
    result.differences =
      diff(normalizedOriginal, normalizedRegenerated, {
        contextLines: 3,
        expand: false,
      }) || 'No diff output';
    result.errors.push('Round-trip HTML does not match original');
  }

  // Step 4: Validate field preservation
  const fieldErrors: string[] = [];
  validateFields(result.plateJson, fieldErrors);

  if (fieldErrors.length > 0) {
    result.success = false;
    result.errors.push(...fieldErrors);
  }

  return result;
}

async function runCli(options: ValidateRoundtripOptions) {
  const html = await fs.readFile(options.input, 'utf-8');
  const result = await runValidation(html);

  if (options.verbose) {
    console.log(`Nodes: ${result.plateJson.length}`);
    console.log(`JSON:\n${JSON.stringify(result.plateJson, null, 2)}\n`);
  }

  if (result.success) {
    console.log('VALIDATION PASSED');
  } else {
    console.log('VALIDATION FAILED');

    if (result.differences) {
      console.log('Differences:');
      console.log(result.differences);
    }
    for (const err of result.errors) {
      console.log(`  - ${err}`);
    }
  }

  if (options.output) {
    await fs.writeFile(
      options.output,
      JSON.stringify(result, null, 2),
      'utf-8'
    );
  }

  return result;
}

// Only run CLI when executed directly (not when imported for testing)
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('validate-roundtrip.ts')
) {
  const args = process.argv.slice(2);
  const options: ValidateRoundtripOptions = {
    failOnDiff: false,
    input: '',
    verbose: false,
  };

  let i = 0;

  while (i < args.length) {
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

Validates HTML -> Plate -> HTML round-trip fidelity.

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
    i++;
  }

  if (!options.input) {
    console.error('Error: --input is required');
    process.exit(1);
  }

  runCli(options)
    .then((result) => {
      if (options.failOnDiff && !result.success) {
        process.exit(1);
      }
    })
    .catch((err: Error) => {
      console.error('Fatal error:', err.message);
      process.exit(1);
    });
}
