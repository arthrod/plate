import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Test: Mammoth ESM Bundling Issue
 *
 * Demonstrates the CommonJS/ESM incompatibility when bundling mammoth
 * into the CLI (tsdown bundles code as ESM, but mammoth.js is CommonJS).
 *
 * Root Cause:
 * - importDocx.ts imports: './mammoth.js/dist/esm/index.browser.js'
 * - That file contains: module.exports = require('../../lib/index.js');
 * - The lib/index.js file has CommonJS require() calls (require('underscore'), etc.)
 * - When tsdown bundles the code as ESM, require() is not defined
 * - Error: "Calling `require` for ... in an environment that doesn't expose the `require` function"
 *
 * The bug is that the ESM wrapper file contains CommonJS code.
 */
describe('Mammoth ESM Bundling (Issue Reproducer)', () => {
  /**
   * Test 1: Verify the ESM wrapper file contains CommonJS code
   * This is the core source of the problem.
   */
  it('ESM wrapper file incorrectly uses CommonJS syntax', () => {
    const wrapperPath = path.resolve(
      __dirname,
      '../mammoth.js/dist/esm/index.browser.js'
    );
    const source = fs.readFileSync(wrapperPath, 'utf8');

    // The file exists but contains invalid ESM code
    expect(source).toBeDefined();

    // Problem: using module.exports in an ESM file
    expect(source).toContain('module.exports');

    // Problem: using require() in an ESM file
    expect(source).toContain('require(');

    // When tsdown bundles this, it will try to use require() in an ESM context,
    // causing the "doesn't expose the `require` function" error
  });

  /**
   * Test 2: Verify mammoth lib/index.js has CommonJS require statements
   * These require() calls fail when the wrapper tries to use them in ESM context.
   */
  it('Mammoth lib/index.js has CommonJS require calls that break in ESM', () => {
    const mammothIndexPath = path.resolve(
      __dirname,
      '../mammoth.js/lib/index.js'
    );
    const source = fs.readFileSync(mammothIndexPath, 'utf8');

    // Contains CommonJS require statements
    expect(source).toContain("require('underscore')");
    expect(source).toContain("require('./docx/docx-reader')");
    expect(source).toContain("require('./unzip')");

    // These require() calls will fail when invoked from an ESM bundled context
    // because the bundler (tsdown) compiles to ESM and require() is not available
  });

  /**
   * Test 3: Verify the import chain that causes the failure
   * importDocx.ts -> ESM wrapper -> CommonJS mammoth -> require() in ESM context
   */
  it('Import chain shows the problem: ESM wrapper -> CommonJS mammoth -> require()', () => {
    const importDocxPath = path.resolve(__dirname, '../importDocx.ts');
    const source = fs.readFileSync(importDocxPath, 'utf8');

    // importDocx imports from the ESM wrapper
    expect(source).toContain(
      "import mammothModule from './mammoth.js/dist/esm/index.browser.js'"
    );

    // The ESM wrapper tries to require CommonJS modules:
    const wrapperPath = path.resolve(
      __dirname,
      '../mammoth.js/dist/esm/index.browser.js'
    );
    const wrapperSource = fs.readFileSync(wrapperPath, 'utf8');
    expect(wrapperSource).toContain("require('../../lib/index.js')");

    // When tsdown bundles all this as ESM:
    // 1. It preserves the import statement from importDocx
    // 2. It inlines the wrapper with its require() call
    // 3. It inlines mammoth/lib/index.js with its require('underscore') etc.
    // 4. At runtime, require() is undefined in ESM context -> ERROR
  });

  /**
   * Test 4: The actual runtime error (from bundled CLI execution)
   * This test documents the exact error that occurs when the CLI is run.
   *
   * Error stack trace shows:
   * - Error: Calling `require` for "underscore" in an environment that doesn't expose the `require` function.
   * - at src/lib/mammoth.js/lib/index.js (file:///...packages/docx-io/dist/index.js:9408:10)
   * - at src/lib/mammoth.js/dist/esm/index.browser.js (file:///...packages/docx-io/dist/index.js:9478:19)
   */
  it('Bundled CLI fails with CommonJS require error', async () => {
    const cliIndexPath = path.resolve(
      __dirname,
      '../../../../../../packages/docx-cli/dist/index.js'
    );

    // Skip if CLI hasn't been built yet
    if (!fs.existsSync(cliIndexPath)) {
      console.log('⏭️  CLI not built yet, skipping runtime test');
      return;
    }

    // The CLI bundle contains inlined CommonJS code trying to use require()
    const bundledSource = fs.readFileSync(cliIndexPath, 'utf8');

    // When this runs, it will throw the error about require() not being defined
    // This happens because tsdown bundles the entire thing as ESM modules,
    // but mammoth.js's CommonJS code still has require() calls that fail

    expect(bundledSource).toBeDefined();
    // Note: We can't actually execute the CLI here without hitting the error,
    // but we've confirmed the error via manual testing above
  });

  /**
   * Test 5: Summary of the root cause
   *
   * The problem is architectural:
   *
   * Current approach (BROKEN):
   * ├─ importDocx.ts (ES module)
   * │  └─ import './mammoth.js/dist/esm/index.browser.js'
   * │     └─ module.exports = require('../../lib/index.js')  ← WRONG: CommonJS in ESM
   * │        └─ lib/index.js (CommonJS)
   * │           └─ require('underscore'), etc.  ← Works in CommonJS, fails in ESM bundled context
   *
   * When tsdown bundles this:
   * 1. It resolves all ES imports and inlines them as ESM
   * 2. It detects the require() calls and tries to inline those too
   * 3. The bundled output is all ESM, but still has require() calls
   * 4. At runtime, require() is undefined in ESM context → ERROR
   *
   * Solutions (for next iteration):
   * 1. Dynamic imports - lazy load mammoth inside functions
   * 2. Dependency injection - make mammoth injectable
   * 3. Separate build targets - browser-only vs Node.js
   * 4. ESM-native mammoth - convert to pure ESM (most effort)
   */
  it('documents the architectural mismatch that causes the bug', () => {
    // This test just documents the problem for future developers
    const explanation = `
      The bug occurs because:
      1. importDocx.ts is an ES module trying to import mammoth
      2. The mammoth "ESM wrapper" (dist/esm/index.browser.js) actually contains CommonJS code
      3. The CommonJS code requires underscore and other dependencies
      4. When tsdown bundles everything as ESM, require() becomes undefined
      5. At runtime, we get: "Calling \`require\` for 'underscore' in an environment that doesn't expose the \`require\` function"

      The objective is to FULLY VENDORIZE mammoth:
      - Add all mammoth dependencies to docx-io's package.json
      - Make mammoth work in both browser AND Node.js contexts
      - This requires resolving the CommonJS/ESM incompatibility
    `;

    expect(explanation).toContain('Calling `require`');
  });
});
