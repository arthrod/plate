# mammoth.js Migration Notes

## Scope

- Package path: `packages/docx-io/src/lib/mammoth.js`
- Baseline for parity checks: upstream `mammoth@1.9.0`

## API Compatibility

No app code change needed for core API usage:

- `convertToHtml(input, options)`
- `convertToMarkdown(input, options)`
- `extractRawText(input)`
- `embedStyleMap(input, styleMap)`
- `readEmbeddedStyleMap(input)`
- `images.imgElement(fn)`
- `styleMapping(...)`
- `transforms.*`

Export key set matches upstream exactly.

## Promise Behavior

- Public methods now run on native promises.
- `.done()` is preserved via shim on returned promises for backward compat with Bluebird-era callsites.

## Validation Runbook (completed)

- Tests: `bun run test` -> `531 passed`
- API parity script (exports + output diff on fixture docx files + style-map embed/read) -> pass
- Browser bundle runtime check (`window.mammoth`, `ArrayBuffer` input) -> pass
- Rebuild from clean state:
  - removed `packages/docx-io/dist`
  - `yarn install`
  - `yarn turbo build --filter=./packages/docx-io`
  - `yarn turbo typecheck --filter=./packages/docx-io`
  - `yarn lint:fix`
  - `bun run build` (mammoth browser bundle)
  - `bun run check-typescript`

## Bundle Size Delta (vs upstream 1.9.0)

- `mammoth.browser.js`: `880,119` -> `701,689` bytes (`-178,430`, ~`-20.3%`)
- `mammoth.browser.min.js`: `634,129` -> `507,116` bytes (`-127,013`, ~`-20.0%`)
- gzip `browser.js`: `177,503` -> `146,498` bytes (`-31,005`, ~`-17.5%`)
- gzip `browser.min.js`: `136,593` -> `113,726` bytes (`-22,867`, ~`-16.7%`)

## Tree-shaking Probe

Probe: bundle only `convertToHtml` via esbuild.

- bundle size: `407,313` bytes
- markdown modules included: `false`
- CLI module (`lib/main.js`) included: `false`
- `embedStyleMap` symbol present: `true` (same source module as `convertToHtml`)

## Build/Tooling Notes

- `build` script now uses `tsup` to emit:
  - `dist/esm/index.mjs` (Node ESM via `exports.import`)
  - `dist/cjs/index.cjs` (Node CJS via `exports.require`)
  - `dist/esm/index.browser.js` (browser ESM condition)
  - `dist/mammoth.browser.js` + `dist/mammoth.browser.min.js` (IIFE globals)
- For in-repo consumer compatibility, `build` also copies `dist/esm/index.browser.js` to top-level `mammoth.browser.js`.
- `check-typescript` now uses `tsconfig.check.json` to avoid monorepo ambient type collisions.
- `@platejs/docx-io` typecheck excludes vendored mammoth tests: `src/lib/mammoth.js/test/**/*` (tests still run in Vitest).
