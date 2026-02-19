# Prompt: Vendor and Refactor mammoth.js to TypeScript

<role>
You are a senior TypeScript engineer performing a vendoring operation: forking mammoth.js (https://github.com/mwilliamson/mammoth.js, v1.9.0+, BSD-2-Clause) into our monorepo and refactoring it from CommonJS JavaScript to idiomatic TypeScript with ESM output. The goal is to produce tree-shakeable, bundler-friendly output with dramatically smaller bundles for consumers who only use a subset of features — while preserving 100% API compatibility so existing users can switch with zero code changes.
</role>

<context>
Mammoth.js converts .docx files to HTML/Markdown/plain-text. It is a mature, well-tested library (~6k GitHub stars) but carries significant technical debt:

- Pure CommonJS with `require()` throughout, `"type": "commonjs"` in package.json
- Depends on obsolete polyfill libraries that have native equivalents since Node 12+
- Uses Browserify (an effectively unmaintained bundler from 2013-era) to produce a monolithic browser bundle
- Has hand-written `.d.ts` type declarations (added in v1.4.19) but NO TypeScript source
- The author (Michael Williamson) also maintains `lop` (the parser combinator used for style-map parsing) and `duck` (test assertion helper) — both untyped JS
- v1.9.2 explicitly tried adding `"type": "commonjs"` but REVERTED it in v1.9.3 because it broke webpack consumers using `mammoth.browser.js`
- No ESM entry point exists; no `exports` field in package.json
- The `"browser"` field in package.json swaps two modules for browser-compatible versions:
  ```json
  "browser": {
    "./lib/unzip.js": "./browser/unzip.js",
    "./lib/docx/files.js": "./browser/docx/files.js"
  }
  ```
  This is the mechanism that lets the same codebase work in Node (with `fs`/`path`) and browsers (with `ArrayBuffer`/JSZip-only).
</context>

<constraints>
- DO NOT change the public API surface. The following must continue to work identically:
  - `mammoth.convertToHtml(input, options)` → Promise with `{value, messages}`
  - `mammoth.convertToMarkdown(input, options)` → Promise with `{value, messages}`
  - `mammoth.extractRawText(input)` → Promise with `{value, messages}`
  - `mammoth.embedStyleMap(input, styleMap)` → Promise
  - `mammoth.images.imgElement(fn)` — image converter factory
  - `mammoth.styleMapping(...)` — style mapping helper
  - `mammoth.transforms.*` — document transform utilities
  - Input shapes: `{path: string}`, `{buffer: Buffer}` (Node); `{arrayBuffer: ArrayBuffer}` (browser)
  - Options: `styleMap`, `includeEmbeddedStyleMap`, `includeDefaultStyleMap`, `convertImage`, `ignoreEmptyParagraphs`, `idPrefix`, `transformDocument`, `externalFileAccess`
- The CLI (`bin/mammoth`) must continue to work
- The existing test suite (~200+ tests using mocha + hamjest + duck) must pass or be faithfully ported
- License compliance: BSD-2-Clause must be preserved; all vendored code must retain original copyright notices
</constraints>

<instructions>
ATTENTION!!!! MOST OF THE BELOW WAS ALREADY CONCLUDED WITH BUGS. NOW YOUR TASK IS:
(1) Confirm if it was concluded or not,
(2) If yes, ensure that the api is identical and the docx-io packages builds correctly,
(3) if it does, study the tests carefully, which are in this folder,
(4) convert such tests to typescript,
(5) run the tests using bun test or something similar that works, NEVER REDUCE COVERAGE!!!
(6) if they pass, remove the dist folders and attempt to install and build again.
(7) after there are no more lint, type, build or installation errors, whether or not they were caused by you or any other person, then you are done.
(8) errors should be fixed, regardless of their origin. 


## Phase 0 — Repository Reconnaissance (DO THIS FIRST, DO NOT SKIP)

Before writing a single line of code, you MUST perform a thorough audit. After checking:

1. **GitHub Issues & Discussions**: Search for issues/PRs about TypeScript, ESM, module bundling, tree-shaking, and modernization. Document:
   - What has been requested by the community
   - What the maintainer has explicitly rejected or accepted
   - Any prior attempts (PRs, forks) and why they succeeded or failed
   - Pay special attention to: issue #193 (type definitions), the v1.9.2 → v1.9.3 CJS/ESM revert in the NEWS file, and issue #159 (Angular "Can't resolve 'path'" — this is the exact class of problem our refactoring MUST solve)

2. **Dependency Audit**: For EACH runtime dependency, determine:
   - Whether it has a modern native equivalent
   - Whether it has TypeScript types (built-in or @types/)
   - Its bundle size impact (use bundlephobia or similar)
   - Whether it needs to be vendored, kept, replaced, or removed

   Current runtime dependencies and their status:
   | Dependency | Version | Assessment |
   |---|---|---|
   | `bluebird` | ~3.4.0 | REMOVE — native `Promise` since Node 4. Mammoth already requires Node ≥12. Every `.then()`, `.catch()`, `.done()`, `Promise.resolve()`, `Promise.all()` maps 1:1. Watch for Bluebird-specific methods like `.tap()`, `.spread()`, `.finally()` |
   | `underscore` | ^1.13.1 | REMOVE — every usage (`_.map`, `_.filter`, `_.extend`, `_.flatten`, `_.find`, `_.some`, `_.indexBy`, `_.values`, `_.keys`, `_.omit`, `_.pick`) has a native equivalent or trivial TS utility. `_.indexBy` → `Object.groupBy` or a 3-line helper |
   | `path-is-absolute` | ^1.0.0 | REMOVE — `path.isAbsolute()` exists since Node 0.11.2 |
   | `base64-js` | ^1.5.1 | REMOVE — `Buffer.from(str, 'base64')` on Node; `atob()`/`btoa()` or `Uint8Array` on browser |
   | `argparse` | ~1.0.3 | EVALUATE — used only by CLI (`bin/mammoth`). Keep if simple, or replace with a lighter alternative. NOT in the browser bundle path |
   | `lop` | ^0.4.2 | VENDOR — this is mwilliamson's own parser combinator library, used to parse style-map strings (e.g., `p[style-name='Heading 1'] => h1`). No types. ~75kB. Must be vendored and typed. It provides: `RegexTokeniser`, `Parser`, and `rules.*` (then, sequence, firstOf, optional, zeroOrMore, etc.) |
   | `@xmldom/xmldom` | ^0.8.6 | KEEP — XML DOM parsing, no native browser/Node equivalent that covers both. Has @types. Consider updating to latest |
   | `jszip` | ^3.7.1 | KEEP — ZIP/OOXML handling, core to .docx reading. Has types. Consider updating |
   | `dingbat-to-unicode` | ^1.0.1 | KEEP — small, single-purpose Wingdings/Symbol font mapping. Vendor if no types |
   | `xmlbuilder` | ^10.0.0 | EVALUATE — used for writing XML (style map embedding). Consider `xmlbuilder2` which has ESM + types, or vendor the subset used |

3. **The Two Browserify Builds — Understand Them Completely**:

   The Makefile contains:
   ```makefile
   mammoth.browser.js:
       node_modules/.bin/browserify lib/index.js --standalone mammoth -p browserify-prepend-licenses > $@

   mammoth.browser.min.js: mammoth.browser.js
       node_modules/.bin/uglify-js mammoth.browser.js -c > $@
   ```

   This produces TWO artifacts:
   - **`mammoth.browser.js`**: A UMD bundle created by Browserify's `--standalone mammoth` flag. This wraps the entire library + all dependencies into a single file that works with CommonJS `require()`, AMD `define()`, or as a `window.mammoth` global. The `-p browserify-prepend-licenses` plugin prepends license text from dependencies.
   - **`mammoth.browser.min.js`**: The above, minified with uglify-js v2.4.x (ancient, pre-ES6).

   The `"browser"` field in package.json tells Browserify (and webpack/rollup) to substitute:
   - `./lib/unzip.js` → `./browser/unzip.js` (uses JSZip directly instead of Node's zlib)
   - `./lib/docx/files.js` → `./browser/docx/files.js` (removes `fs.readFile` dependency)

   **Our replacement strategy**: Replace Browserify with a modern bundler (tsup, esbuild, or rollup) that:
   - Produces ESM (primary) + CJS (compat) from TypeScript source
   - Produces a UMD browser bundle equivalent to `mammoth.browser.js` (for CDN/script-tag users)
   - Uses `package.json` `exports` field with conditional exports for node/browser/import/require
   - Preserves the browser module substitution pattern (now via `exports` conditions, not `"browser"` field hacks)

4. **Internal Architecture Audit**: Map the module dependency graph. Key modules:
   - `lib/index.js` — public API entry point
   - `lib/docx/docx-reader.js` — OOXML → internal document model
   - `lib/docx/body-reader.js` — reads document body elements
   - `lib/docx/style-map.js` — uses `lop` to parse style mappings
   - `lib/html/` — internal document model → HTML
   - `lib/markdown/` — internal document model → Markdown
   - `lib/documents.js` — internal document model types (THIS IS YOUR SCHEMA)
   - `lib/results.js` — Result monad (value + messages)
   - `lib/writers/` — HTML/Markdown string writers
   - `lib/unzip.js` / `browser/unzip.js` — platform-specific ZIP handling
   - `lib/docx/files.js` / `browser/docx/files.js` — platform-specific file reading

   Identify ALL inline type patterns. Mammoth uses a hand-rolled type system with patterns like:
   ```javascript
   // documents.js — discriminated unions via type properties
   function Paragraph(children, properties) {
       return { type: "paragraph", children: children, ... };
   }
   function Run(children, properties) {
       return { type: "run", children: children, ... };
   }
   ```
   These MUST become a proper TypeScript discriminated union schema in a single `types.ts` or `schema.ts` file. Every `type: "paragraph"`, `type: "run"`, `type: "table"`, etc. must be a typed interface in that schema.

## Phase 1 — Schema Extraction

Extract all document model types from `lib/documents.js` and related files into a single `src/schema.ts` file. This is the heart of the refactoring.

- Define a discriminated union `DocumentElement` with all node types
- Define `Result<T>` as a generic type (replacing the ad-hoc result pattern)
- Define `StyleMap`, `StyleMapping`, and related types
- Define `ConvertOptions`, `Input` (with platform variants), and all public option types
- Export ALL types — these become the library's type contract

## Phase 2 — Remove Inline Imports, Adopt Single Schema

The current codebase has `require("./documents")` scattered across dozens of files, each using a different subset of the constructors. After creating the schema:

- Replace ALL `var documents = require("./documents")` and `documents.Paragraph(...)` calls with typed imports from `schema.ts`
- Replace ALL `var results = require("./results")` patterns with the generic `Result<T>` type
- Replace ALL inline `{type: "..."}` object literals with schema constructor functions or typed object literals
- Ensure that EVERY function signature has explicit parameter and return types — no `any` leaks

## Phase 3 — Dependency Modernization

Execute the replacements identified in Phase 0:
- `bluebird` → native Promises (ensure no Bluebird-specific API usage survives)
- `underscore` → native array/object methods + tiny typed utility functions where needed
- `path-is-absolute` → `path.isAbsolute()`
- `base64-js` → platform-native base64 handling
- `lop` → vendored into `src/vendor/lop/` with full TypeScript types
- `dingbat-to-unicode` → vendor if untyped

## Phase 4 — Build System

Replace the Makefile + Browserify toolchain:
- Use `tsup` or equivalent to produce:
  - `dist/esm/` — ESM output (primary, tree-shakeable)
  - `dist/cjs/` — CJS output (backward compat)
  - `dist/mammoth.browser.js` — UMD standalone (CDN compat)
  - `dist/mammoth.browser.min.js` — minified UMD
- Configure `package.json`:
  ```json
  {
    "type": "module",
    "main": "./dist/cjs/index.cjs",
    "module": "./dist/esm/index.js",
    "types": "./dist/esm/index.d.ts",
    "exports": {
      ".": {
        "import": { "types": "./dist/esm/index.d.ts", "default": "./dist/esm/index.js" },
        "require": { "types": "./dist/cjs/index.d.cts", "default": "./dist/cjs/index.cjs" },
        "browser": "./dist/esm/index.browser.js"
      },
      "./browser": "./dist/mammoth.browser.js"
    },
    "browser": {
      "./dist/esm/unzip.js": "./dist/esm/unzip.browser.js",
      "./dist/esm/docx/files.js": "./dist/esm/docx/files.browser.js"
    }
  }
  ```
- The UMD bundle MUST expose `window.mammoth` with the same API as before
- Verify: existing code doing `const mammoth = require("mammoth")` still works
- Verify: existing code doing `import mammoth from "mammoth"` works
- Verify: `<script src="mammoth.browser.min.js">` + `window.mammoth.convertToHtml(...)` works

## Phase 5 — Test Migration

- Port tests from mocha + hamjest + duck to vitest (or keep mocha if simpler)
- The `duck` library is another mwilliamson package — it's a test assertion helper for checking object shapes. Replace with native TypeScript type checking or a standard matcher
- `hamjest` is a Hamcrest-style matcher library — replace with vitest's `expect` matchers
- ALL existing test cases must be ported faithfully. Do not delete test coverage to make tests pass
- Add type-checking as a test step: `tsc --noEmit` must pass with `strict: true`

## Phase 6 — Validation

Before declaring success:
1. Run the full test suite
2. Bundle size comparison: measure the UMD bundle size before and after. Document the delta
3. Tree-shaking test: create a minimal consumer that only imports `convertToHtml` and verify the bundle excludes Markdown/CLI/embedStyleMap code
4. Integration test: convert the same .docx files with the original mammoth and the vendored version, diff the HTML output — it MUST be identical
5. Browser test: load `mammoth.browser.min.js` in a browser, convert a .docx from an ArrayBuffer

</instructions>

<reference_projects>
The following projects performed similar vendoring/TS-rewrite operations and are worth studying for patterns and pitfalls:

1. **ProseMirror → TypeScript** (2022): Marijn Haverbeke rewrote all ProseMirror packages from JS to TS. This broke downstream consumers (notably Tiptap — see tiptap#2836) because generic type parameters were removed from the public API. LESSON: When rewriting, your `.d.ts` output must be backward-compatible with the old hand-written declarations. Diff them.

2. **macwright.com "Vendor by Default"** (2021): Tom MacWright's essay on vendoring philosophy — argues that absorbing dependencies into your codebase lets you remove polyfills, strip unused code, and add types. Exactly our playbook.

3. **mammoth-plus** (ihwf/mammoth-plus): A fork of mammoth.js that adds math/OMML support. Stayed in JS, kept all the same deps. Shows what features people want but also demonstrates the cost of NOT modernizing — it carries the same bluebird/underscore/browserify debt.

4. **htmx "Vendoring" essay**: Carson Gross's philosophical case for vendoring. Emphasizes that vendored code is YOUR responsibility, and the trade-off is visibility + control vs. upstream tracking overhead.

5. **sindresorhus ESM migration** (meta#15): The contentious discussion about moving npm packages to ESM-only. Our approach (dual CJS+ESM via exports) avoids the breakage sindresorhus caused, while still getting tree-shaking benefits.

6. **cjstoesm** (wessberg/cjstoesm): A tool that mechanically converts CJS to ESM. Useful for the initial pass but does NOT add types — that's the hard part we must do manually.
</reference_projects>

<critical_risks>
- **Bluebird `.done()` removal**: Bluebird's `.done()` method throws unhandled rejections. Native promises don't have `.done()`. If user code calls `.done()` on returned promises, it will break. Check if the public API ever returned Bluebird promises with `.done()` exposed. (Answer: yes, the README examples use `.done()` — BUT `.catch()` is also shown and is the modern pattern. The `.done()` calls are Bluebird-specific and must be documented as deprecated.)
- **Browser field resolution differences**: Webpack 4 vs 5 handle the `"browser"` field differently. The `exports` field in package.json takes precedence in modern bundlers. Test with BOTH.
- **lop vendoring depth**: `lop` depends on `underscore` internally. When vendoring lop, you must also remove its underscore dependency.
- **xmlbuilder version**: v10 is CJS-only. `xmlbuilder2` is ESM-native with types but has API differences. Evaluate carefully.
</critical_risks>

<output_expectations>
- A working TypeScript codebase under `src/` that compiles cleanly with `strict: true`
- A `schema.ts` containing all document model types as a discriminated union
- All tests passing
- Bundle size report (before/after)
- A MIGRATION.md documenting every behavioral difference, however minor
- A clear `exports` map in package.json with Node/browser/CJS/ESM conditions
- ATTENTION!!!! MOST OF THE ABOVE WAS ALREADY CONCLUDED WITH BUGS. NOW YOUR TASK IS:
(1) Confirm if it was concluded or not,
(2) If yes, ensure that the api is identical and the docx-io packages builds correctly,
(3) if it does, study the tests carefully, which are in this folder,
(4) convert such tests to typescript,
(5) run the tests using bun test or something similar that works, NEVER REDUCE COVERAGE!!!
(6) if they pass, remove the dist folders and attempt to install and build again.
(7) after there are no more lint, type, build or installation errors, whether or not they were caused by you or any other person, then you are done.
(8) errors should be fixed, regardless of their origin. 

</output_expectations>
