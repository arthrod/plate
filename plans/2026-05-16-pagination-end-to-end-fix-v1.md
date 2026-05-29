# Pagination Plugin — End-to-End Fix & Deploy

## Objective

Fix the pagination plugin integration in the playground template so that:
1. The toolbar button correctly reads/writes plugin state (fix hardcoded values, wrong header/footer detection)
2. The WIP placeholder comment is removed
3. Vendor copy is regenerated from the refactored source package
4. `bun run deploy` from the repo root correctly cleans, builds, and deploys to Cloudflare
5. The full build pipeline works: `build:pagination` → `vendor:pagination` → `deploy`

## Sage Research Findings Summary

The Sage agent analysis revealed 10 contradictions between the source package (`packages/pagination/`) and the template vendor copy (`templates/plate-playground-template/vendor/platejs-pagination/`). Key findings:

| # | Issue | Impact |
|---|-------|--------|
| 1 | Vendor copy is stale (pre-refactoring snapshot) | All 12 refactor tasks from `docs/plans/2026-05-15-pagination-plugin-refactor.md` are missing from vendor |
| 2 | `pagination-toolbar-button.tsx:90` hardcodes `pageSize = 'A4'` | Page size radio always shows A4 selected |
| 3 | `pagination-toolbar-button.tsx:93-98` checks root children for headers/footers | Detection always returns `false` — headers live inside page children |
| 4 | `editor-kit.tsx:74` says "placeholder until @platejs/pagination ships" | Misleading WIP comment |
| 5 | Toolbar accesses `editor.tf as unknown as { pagination? }` | Fragile type cast |
| 6 | Vendor Yjs export in main barrel instead of `./yjs` subpath | Wrong import path |
| 7 | Source uses WeakMap registry; vendor uses bolt-on `editor.__paginationRuntime` | Architecture mismatch |
| 8 | Source uses microtask-coalesced dirty notifications; vendor is synchronous | Performance mismatch |
| 9 | Source has dedicated 200ms resize debounce; vendor has none | Jank on resize |
| 10 | Source has linear-scan fallback for non-monotonic offsetTop; vendor binary-search only | Edge-case fragility |

## PR #4830 Context (GitHub)

PR #4830 (`feat(docx-io): add docXMLater adapter layer for DOCX export`) covers pagination as one of 40+ element types in the DOCX export adapter. The PR was closed without merge. Key bot feedback:
- **changeset-bot**: "⚠️ No Changeset found" — no version bump would occur
- **vercel**: Deployment was "Skipped" (Ignored)

This is a docx-io PR, not a pagination-specific PR, but it references pagination as a covered element type.

## Implementation Plan

### Phase 1: Fix Template Toolbar (Source of Truth)

- [ ] **Task 1.** Fix `pageSize` being hardcoded to `'A4'` in `pagination-toolbar-button.tsx:90`.

  **Rationale**: Line 90 sets `const pageSize: PaginationOptions['pageSize'] = 'A4'` unconditionally. The actual page size is stored in `documentSettings.sizes` on the plugin options. Read it from `usePluginOption(BasePaginationPlugin, 'documentSettings')` and derive the page size key by comparing against `PAGE_SIZES` presets (A4: 794x1123, Letter: 816x1056, Legal: 816x1344). If no preset matches, return the raw sizes object.

  **Files**: `templates/plate-playground-template/src/components/ui/pagination-toolbar-button.tsx`

- [ ] **Task 2.** Fix `headerPresent`/`footerPresent` detection to look inside page children, not root children.

  **Rationale**: `pagination-toolbar-button.tsx:93-98` checks `value` (document root children) for `type === 'header'` and `type === 'footer'`. But pages are root children, and headers/footers live as first/last children within each page. The correct check: iterate root children (pages), then for each page, check if its first child is type `'header'` or last child is type `'footer'`.

  **Files**: `templates/plate-playground-template/src/components/ui/pagination-toolbar-button.tsx`

- [ ] **Task 3.** Remove WIP placeholder comment from `editor-kit.tsx:74`.

  **Rationale**: The comment `// Pagination (placeholder until @platejs/pagination ships — PRs #357/#358)` is stale. The plugin ships in the vendor copy. Replace with `// Pagination`.

  **Files**: `templates/plate-playground-template/src/components/editor/editor-kit.tsx`

- [ ] **Task 4.** Fix toolbar type cast from `as unknown as { pagination?: PaginationTransforms }` to use the typed transform namespace.

  **Rationale**: `pagination-toolbar-button.tsx:100-102` casts `editor.tf` through `unknown` to access `.pagination`. The `BasePaginationPlugin` exports `PaginationTransforms` type via `extendTransforms`. Import and use the proper `PaginationTransforms` type directly. Use `editor.tf.pagination` (typed via `PlateEditor['tf']` merged with the plugin's transform types) or import `PaginationTransforms` and cast narrowly.

  **Files**: `templates/plate-playground-template/src/components/ui/pagination-toolbar-button.tsx`

### Phase 2: Vendor Copy Regeneration

- [ ] **Task 5.** Build the source pagination package and regenerate the vendor copy.

  **Rationale**: The vendor directory `templates/plate-playground-template/vendor/platejs-pagination/` contains a stale pre-refactoring snapshot. The source package at `packages/pagination/` has been refactored (WeakMap registry, microtask coalescing, resize debounce, linear-scan fallback, debug gating, empty page guard). Steps:
  1. Build the pagination package: `pnpm turbo build --filter=./packages/pagination`
  2. Run vendor script: `cd templates/plate-playground-template && bun run vendor:pagination`

  **Verification**: After vendoring, the `vendor/platejs-pagination/dist/` should contain the refactored code (confirm WeakMap usage, microtask coalescing, resize debounce present in the output).

- [ ] **Task 6.** Verify the vendor copy matches the source package structure.

  **Rationale**: The source package has subpath exports (`./yjs`) and internal modules (`editorRegistry`, `reflowEngine`, `runtime`). The vendor copy must maintain the same export surface. Check:
  - `dist/index.js` exports match `packages/pagination/src/index.ts`
  - `dist/yjs/index.js` exists (subpath export)
  - No `editor.__paginationRuntime` bolt-on in the output (should use WeakMap)

### Phase 3: Build & Deploy Pipeline

- [ ] **Task 7.** Add root-level `deploy:playground` script that cleans, builds pagination, vendors, and deploys.

  **Rationale**: The user wants `bun run deploy` from root to work. Currently no such script exists. The chain is:
  1. Build pagination package (if not built): `pnpm turbo build --filter=./packages/pagination`
  2. Vendor pagination: `cd templates/plate-playground-template && bun run vendor:pagination`
  3. Install template deps (vendor file: link): `cd templates/plate-playground-template && bun install`
  4. Deploy: `cd templates/plate-playground-template && bun run deploy`
  
  Add to root `package.json` scripts: `"deploy:playground": "pnpm turbo build --filter=./packages/pagination && cd templates/plate-playground-template && bun run vendor:pagination && bun install && bun run deploy"`

  **Files**: `package.json`

- [ ] **Task 8.** Verify the deployment pipeline works end-to-end.

  **Rationale**: The `bun run deploy` in the template calls `opennextjs-cloudflare build && opennextjs-cloudflare deploy`. This requires:
  - `wrangler.toml` or Cloudflare config present
  - `@opennextjs/cloudflare` installed (confirmed in devDependencies)
  - Vendor copy correctly linked via `file:./vendor/platejs-pagination`
  
  Verify by running the deploy command (dry-run if possible). Check that the Next.js build picks up the vendor copy without import errors.

### Phase 4: Verification

- [ ] **Task 9.** Verify typecheck passes for the template.

  **Rationale**: After fixing the toolbar types and regenerating vendor copy, run `cd templates/plate-playground-template && bun typecheck` to ensure no TypeScript errors.

- [ ] **Task 10.** Verify lint passes for the template.

  **Rationale**: Run `cd templates/plate-playground-template && bun lint:fix` to auto-fix and verify no lint errors.

## Verification Criteria

- [ ] `pagination-toolbar-button.tsx` reads actual `documentSettings.sizes` for page size display
- [ ] `pagination-toolbar-button.tsx` correctly detects headers/footers inside page children
- [ ] WIP comment removed from `editor-kit.tsx:74`
- [ ] Toolbar type cast uses proper `PaginationTransforms` type (not `as unknown`)
- [ ] `vendor/platejs-pagination/dist/` contains refactored code (WeakMap, microtask, resize debounce)
- [ ] `pnpm turbo build --filter=./packages/pagination` succeeds
- [ ] `bun run vendor:pagination` succeeds from template directory
- [ ] `bun typecheck` passes in template directory
- [ ] `bun lint:fix` passes in template directory
- [ ] `bun run deploy` succeeds from template directory (deploys to Cloudflare)

## Potential Risks and Mitigations

1. **[R] Vendor copy generation may fail if `packages/pagination/dist` doesn't exist**
   Mitigation: Task 7 runs `pnpm turbo build --filter=./packages/pagination` before vendoring. The vendor:pagination script does `cp -r ../../packages/pagination/dist vendor/platejs-pagination/dist`.

2. **[R] Template `bun install` may break with `file:./vendor/platejs-pagination` after vendor regeneration**
   Mitigation: Bun's file: protocol creates symlinks. If the dist structure changed, run `bun install --force` in the template directory.

3. **[R] Cloudflare deployment may fail due to missing wrangler config or auth**
   Mitigation: The template already has `@opennextjs/cloudflare` and `wrangler` in devDependencies. Cloudflare auth is handled by wrangler login/token. This is environment-specific and outside code scope.

4. **[R] Toolbar header/footer detection may still show incorrect state if pages are normalized differently**
   Mitigation: The fix checks page children (index 0 for header, last index for footer). Added after the fix, verify with `bun run dev` in the template before deploying.

## Alternative Approaches

1. **[Alt] Use `editor.api.pagination` instead of `editor.tf.pagination`**: More aligned with Plate convention (api = custom methods, tf = Slate transforms). Trade-off: requires updating the toolbar button import pattern and the `extendTransforms` → `extendApi` migration. Deferred to follow-up.

2. **[Alt] Remove vendor copy entirely and use workspace protocol**: Link `@platejs/pagination` as `"workspace:*"` instead of `"file:./vendor/platejs-pagination"`. Trade-off: simpler dev flow but breaks standalone template deployment (template must be self-contained for `shadcn` init). Keep vendor copy for standalone deployability.

3. **[Alt] Publish `@platejs/pagination` to npm and use semver dependency**: Instead of vendoring, publish the package and reference it normally. Trade-off: requires npm publish workflow, changeset, and versioning. The vendor approach is already in place and works for the template pattern.
