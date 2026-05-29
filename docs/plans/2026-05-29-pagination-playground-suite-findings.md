# Pagination playground suite — recon findings

**Date:** 2026-05-29
**Task:** 8-point feature set on top of `work/pagination-synthesized` — settings modal, dotted continuous view, interactive margins mode (editable header/footer/footnote), toolbar buttons, click-out exit, per-chrome fonts/styles, document-JSON metadata persistence, footnotes/endnotes, Cloudflare deploy.
**Invariant:** pretext backend measurement; NO DOM mutation in contenteditable; NO doc-tree mutation for layout. Derived projection.

> Working findings file (planning-with-files, repo override → single file under docs/plans/). Recon agents write here; design + decisions appended below.

---

## Area: React layer (`@platejs/pagination/react`) — CONFIRMED

**Summary.** Composable overlay: renders **dashed** break-line markers + optional header/footer chrome bands above/below an unmodified contenteditable. Honors invariants: zero DOM mutation in contenteditable, zero doc-tree mutation (read-only projection of pretext layout), positioning via CSS absolute + `pointer-events: none`. Chrome bands are **DECORATIVE** today — render functions get `ChromeRenderContext` `{pageIndex, pageCount, page, margins}` → return static `React.ReactNode`; bands are NOT editable. A React hook (`useIsomorphicLayoutEffect`) orchestrates snapshot→measure→compose, caches layout in a registry with dirty-flag invalidation, applies CSS-only side effects (top-margin spacers on page-start blocks) via `alignContent`. Overlay mounts as `afterEditable` sibling (not wrapping). ResizeObserver watches editable **width** only. `enabled` toggle has `prevEnabledRef` to force recompute on false→true.

**Key files:**
- `packages/pagination/src/react/PaginationPlugin.tsx` — overlay mount; break-line render **dashed CSS lines ~248–270** (`borderTop: '1px dashed'`); chrome render ~156–226; layout orchestration ~296–353; ResizeObserver width-watch ~360–379; enabled+prevEnabledRef ~279–309
- `packages/pagination/src/react/geometry.ts` — pure page geometry: `getPageGeometry`, `getBlockPlacements`
- `packages/pagination/src/react/alignContent.ts` — CSS-only: `computePageStartSpacers`, `alignContentToLayout` (margin-top on page-start blocks, no model mutation)
- `packages/pagination/src/react/domMeasure.ts` — `topLevelBlockElements`, `createDomMeasure` (live font/width + pretext height)
- `packages/pagination/src/react/chrome/PageNumber.tsx` — pure render fns: `PageNumber`, `PageNumberWithTitle`, `PageNumberMinimal`, `TextHeader`
- `packages/pagination/src/react/index.ts` — barrel

**Public API (react):** `PaginationPlugin`, `PaginationBreakLines`, `alignContent`, `PageNumber`, `PageNumberWithTitle`, `PageNumberMinimal`, `TextHeader`, `domMeasure`, `geometry`, `getPageGeometry`, `getBlockPlacements`, `computePageStartSpacers`, `alignContentToLayout`, `createDomMeasure`, `ChromeRenderContext`.

**Gaps vs 8 points (react):**
- Chrome editability: render fns are decorative/static; margins mode (#3) needs interactive editable chrome — architecturally invasive vs current pure-overlay projection.
- Dotted lines: hardcoded `1px dashed` (line 249); no option/className to switch dashed↔dotted (#2 asks dotted).
- No `aria-hidden`/`role=presentation` on chrome divs yet.
- No settings store/modal integration; chrome config is static at setup; runtime margin/page changes need external state (#1).
- No page-size preset store; widths derive from `layout.pages[].spec.widthPx` (#1 page size).
- No footnote chrome (footer/header only) (#1 toggle, #3 edit).

**Recommendations (react):** add `breakLineStyle?: 'dashed'|'dotted'|string` option threaded to `PaginationBreakLines`; add `aria-hidden`; introduce settings store (Context/Zustand) feeding `plugin.configure`; page-size presets (`letter`/`a4`/custom) computed before `getPageGeometry`; extend chrome config to `{header?, footer?, footnote?}`.

---

## Area: engine + measure — CONFIRMED (direct read)

`layout/types.ts`: `PageSpec {widthPx,heightPx,preset?:'a4'|'letter'}`, `PageMargins {topPx,rightPx,bottomPx,leftPx}`, `LayoutPolicies {widowLinesMin,orphanLinesMin,keepWithNextEnabled}`, `LayoutInput {page,margins,policies,chrome?:{header?:{heightPx},footer?:{heightPx}}}`. Chrome render fns live OUTSIDE layout output (on plugin options); composer only needs `heightPx`. `PageLayout.chrome` carries `PageChromeRect {x,y,heightPx,widthPx}` per page (identical across pages). `MeasuredBlock` has text-only `heightPx`/`lineCount`/`lineHeightPx` + `flowHeightPx` for packing; `splittable`/`keepWithNext`/`breakBefore` hints. `BlockFragment` supports cross-page splitting w/ `breakReason`. `LayoutOutput {pages,metrics,mapping}`.
`measure/pretext.ts`: `measureTextLines(text,font,widthPx,lineHeightPx)` + `measureBlockHeight(...)` via `@chenglou/pretext` `prepareWithSegments`+`layoutWithLines` — real glyph-width wrapping; block height = lineCount×lineHeight. **Invariant honored.** Needs browser-like canvas; tests inject a canvas stub.

## Area: options + persistence — CONFIRMED

`lib/BasePaginationPlugin.ts`: `createTSlatePlugin<PaginationConfig>` key `'pagination'`. `PaginationOptions = {enabled?,page:PageSpec,margins:PageMargins,policies,viewMode:'continuous'|'paged',atomicTypes[],keepWithNextTypes[],chrome?:{header?:PageChromeOption,footer?:PageChromeOption}}`. `PageChromeOption = {heightPx, render:(ctx:ChromeRenderContext)=>unknown}`. DEFAULTS: enabled true, A4 794×1123 @96dpi, margins 96px (1in) all sides, widow/orphan 2, viewMode continuous. `.overrideEditor` wraps `apply` → `shouldInvalidateLayout(op)` → `invalidateLayoutRegistry(editor)` (registry dirty-on-edit). **No `PaginationViewMode` 'print'; just continuous|paged.**
**PERSISTENCE: none. All config is runtime plugin options. Nothing written to `editor.children`.** → point 7 is net-new. No doc-meta node convention in Slate/Plate (value = `Descendant[]`); need a chosen semantic home + sync to options.

## Area: playground / source-of-truth — CONFIRMED

- `apps/www/src/app/dev/pagination2/{page.tsx,pagination2-view.tsx}`: a BARE demo — `usePlateEditor({plugins:[...BasicNodesKit, PaginationPlugin]})` rendered via `<Plate><PlateContent/></Plate>` inside a hand-styled A4 "desk". **No fixed toolbar.** `page.tsx` sets `export const dynamic='force-dynamic'` (browser-only; engine reads real DOM fonts).
- **Toolbar source of truth = registry:** `apps/www/src/registry/ui/fixed-toolbar-buttons.tsx` (`FixedToolbarButtons`), `fixed-toolbar.tsx`, plus kit `components/editor/plugins/fixed-toolbar-kit.tsx`. First buttons today = Undo/Redo group (line ~57). **This file currently has NO pagination button** (commit 14686c6ac's toggle is NOT here — likely template-local or a different editor). To prepend modal+margins buttons → edit registry `fixed-toolbar-buttons.tsx`.
- Template editor is generated/consumed from the registry (shadcn/skiller). `templates/**` is CI-controlled per CLAUDE.md → edit registry source, not template.
- Registry tree: `apps/www/src/registry/{ui,components,blocks,examples,hooks,lib,app}`.

## Area: tests / harness — PARTIAL

Specs under `packages/pagination/src/{layout,lib,measure,react}/__tests__/`: compose, compose-chrome, compose-chrome-edge-cases, continuous, mapping, projection, snapshot, BasePaginationPlugin, registry, measure, pretext, geometry, + CodeRabbit/Gemini regression specs. No vitest config in pkg → runner is `plate-pkg p:test` (repo standard: bun/jest wrapper). Run via `pnpm --filter @platejs/pagination test` or `bun run test`. New TDD: layout/lib for pure logic, react for overlay/editable, e2e under template tests for browser. (Runner exact cmd to confirm at impl time.)

## Area: deploy / Cloudflare — CONFIRMED

Template has `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`. Template scripts: `deploy = opennextjs-cloudflare build && opennextjs-cloudflare deploy`; `vendor:pagination` = `rm -rf vendor/platejs-pagination/dist node_modules/@platejs/pagination/dist && cp -r ../../packages/pagination/dist vendor/platejs-pagination/dist && cp -r vendor/platejs-pagination/dist node_modules/@platejs/pagination/dist`; `preview:cf`, `cf-typegen`. Root `deploy:playground` = build pagination → cd template → `vendor:pagination` → `bun install --frozen-lockfile` → opennext build → deploy. Memory: Next 16.2.6 floor, webpack (not Turbopack), edge-route + 25 MiB asset fixes already solved. Deploy needs CF account/wrangler auth.

## Area: doc-metadata + editable-subregion + footnote prior art — CONFIRMED

- **Doc metadata:** No Slate top-level meta slot; value is `Descendant[]`. Semantic options: (a) dedicated top-level void node `pageSetup` at children[0] that the engine skips; (b) persistence envelope `{meta,children}` wrapped by app save/load; (c) editor-level field saved separately. DECISION PENDING (north-star governs).
- **Editable sub-regions prior art:** `@platejs/caption` `CaptionTextarea.tsx` (editable region outside main flow), `useEditableProps`, `selection/BlockSelectionAfterEditable` (afterEditable overlay pattern — same seam pagination uses). Nested-Plate-editor pattern available for header/footer/footnote editing.
- **Footnotes: `@platejs/footnote` EXISTS** (template already deps `^53.0.0`). `TFootnoteElement = TElement & {identifier?}`. Has `BaseFootnoteReferencePlugin`, `BaseFootnoteDefinitionPlugin`, `BaseFootnotePlugins`, `footnoteRegistry`, `getNextFootnoteIdentifier`, `createFootnoteDefinition`, focus transforms, `FootnoteInputPlugin`/`FootnoteReferencePlugin` (react). Build footnote toggle/edit ON THIS, do not reinvent.

## Area: toolbar / modal UI primitives — CONFIRMED

`FixedToolbarButtons` (registry/ui/fixed-toolbar-buttons.tsx) is a flex row of `ToolbarGroup`s; first group = Undo/Redo. Reusable patterns present: `FontSizeToolbarButton`, `LineHeightToolbarButton`, `FontColorToolbarButton`, `ModeToolbarButton` (readonly/view toggle) — reuse for point 6 styling controls + print/view toggle. shadcn primitives expected under `registry/ui/` (dialog, dropdown-menu, select, tabs, popover, radio-group, input, switch, label, button) — confirm exact filenames at impl.

---

# Decomposition (sub-projects → stacked PRs onto work/pagination-synthesized)

- **A. Engine/options polish:** dotted break-line option, `aria-hidden` chrome, page-size presets + unit-agnostic px plumbing. (small, pure → TDD easy)
- **B. Document-metadata layer (pt 7):** semantic `pageSetup` home in doc JSON + bidirectional sync to plugin options. (north-star)
- **C. Settings modal (pt 1):** margins/page-size w/ in↔cm↔px conversion @96dpi, print-view button, footnote/endnote toggle, page-number placement dropdown.
- **D. Editable margins mode (pt 3,5,6):** nested editors for header/footer/footnote; enter via button, exit via button or click-outside; per-region font/style. (hardest; north-star)
- **E. Footnotes/endnotes integration (pt 1,3):** build on `@platejs/footnote`; endnote vs per-page placement.
- **F. Print view (pt 1):** view-only paged render (`@page` CSS / paged projection).
- **G. Playground wiring + CF deploy (pt 4, deploy):** registry toolbar buttons → template regen → `deploy:playground`.

---

# Decisions (LOCKED by user 2026-05-29)

1. **Editable chrome mechanism = rich `contentEditable` inputs** per region (header/footer/footnote), with a small floating style toolbar (font family/size/color, bold, italic). Value serialized (marks model) into metadata. NOT full nested Plate editors.
2. **Persistence = top-level `pageSetup` void node at `children[0]`.** Engine skips it in snapshot; normalizer guarantees ≤1 at [0]; data synced bidirectionally to plugin options so engine + overlay react. Travels in the document JSON (point 7).
3. **Defaults = US Letter + inches.** Page 816×1056 px (8.5×11in @96dpi), margins 1in all sides, default unit = inches; cm + px also selectable. Conversion util canonicalizes to px @96dpi.
4. **Footnotes = reuse `@platejs/footnote`** (already endnote-style). Modal toggle wires the FootnoteKit in/out; no new footnote engine. Editing footnote content = normal editing of the definition nodes.

## north-star reaffirmation
Public-API changes to `@platejs/pagination` (new `breakLineStyle`, `pageSetup` node + transforms, chrome editability) → **north-star reaffirmed: laws + decision-ladder** (owner = pagination package; layer = lib semantic base for the node/transforms, react for overlay/edit surface; canonical semantics, not app sugar; no hot-path regression — pageSetup sync is edit-time, not per-keystroke layout). Will re-confirm per PR if shape shifts.

---

# Per-PR TDD plan (stacked onto work/pagination-synthesized)

Each PR: red→green→refactor, `check` before PR, changeset, stacked over predecessor.

- **PR-A `…suite-a-foundation`** (pure, low-risk):
  - `measure`/`lib` unit-conversion util `toPx({value,unit})` + `fromPx` (in↔cm↔px @96dpi). RED pure tests.
  - preset helper `getPresetPageSpec('letter'|'a4')` → letter 816×1056. RED pure tests.
  - `breakLineStyle?: 'dashed'|'dotted'|'solid'` option on `PaginationOptions` (default preserve 'dashed'); thread to `PaginationBreakLines`. Demo sets 'dotted' (point 2).
  - `aria-hidden`/`role=presentation` on chrome bands.
- **PR-B `…suite-b-pagesetup`** (north-star): `pageSetup` node type + schema; `BasePageSetupPlugin` (void, skipped, normalized); transforms `getPageSetup`/`setPageSetup`; snapshot skip; sync pageSetup→options. RED: round-trip serialize, normalize singleton, engine-skip, option sync.
  - First materially-changed reusable API → ce-review / adversarial verify before merge.
- **PR-C `…suite-c-modal`**: settings modal (shadcn dialog) — margins (4 inputs+unit), page size (preset+custom+unit), print-view button (stub→F), footnote/endnote toggle, page-number placement dropdown; writes via setPageSetup. RED: conversion + reducer logic; browser-verify UI.
- **PR-D `…suite-d-margins-mode`**: margins-mode controller (enter via button; exit via button OR click-outside chrome — point 5); editable contentEditable header/footer (+footnote) with style toolbar (point 6); serialize to pageSetup. RED: enter/exit state machine, click-outside predicate, marks (de)serialize.
- **PR-E `…suite-e-footnotes`**: wire `@platejs/footnote` FootnoteKit into playground editor; modal toggle gates it. RED minimal; browser-verify.
- **PR-F `…suite-f-print`**: print view button → `@page` size/margins from pageSetup + view-only paged render / `window.print()`. Browser-verify.
- **PR-G `…suite-g-playground-deploy`**: prepend modal-open + margins-mode buttons to `FixedToolbarButtons` (registry/ui); wire plugins into playground editor; build pagination → vendor → opennext → CF deploy (`deploy:playground`).

## Progress log
- 2026-05-29: recon complete (8 areas mapped). Decisions locked.
- 2026-05-29: **PR-A DONE** (branch `work/pagination-suite-a-foundation`, commit `9f6cfae1f`). units.ts (lengthToPx/pxToLength), presets.ts (getPresetPageSpec), breakLineStyle option+wiring, aria-hidden chrome. Fixed pre-existing typecheck (MeasureCache import, ComposeMetrics shape) + lint debt. Evidence: 102 pagination tests pass, pkg typecheck 8/8, biome clean. Changeset written.
- 2026-05-29: **PR-B DONE** (branch `work/pagination-suite-b-pagesetup`, commit `51aadda5d`). `BasePageSetupPlugin` (void `page_setup` node + singleton normalizer), `getPageSetup`/`setPageSetup`/`DEFAULT_PAGE_SETUP`/`PageSetupConfig`, `buildSnapshot` `skipTypes`. Evidence: 112 pagination tests pass, pkg typecheck clean, biome clean. Changeset written. Node is inert until PR-C renders+creates it.
- 2026-05-29: **PR-C engine-live DONE** (branch `work/pagination-suite-c-modal`, commit `66f8b406a`). `PageSetupPlugin`/`PageSetupElement` (invisible zero-height void at index 0 — path-aligned, no `topLevelBlockElements` change needed since DOM lookup is keyed by real `path[0]`), host reads page+margins from the `page_setup` node + `buildSnapshot` `skipTypes`, `pageSetupToLayoutInput`/`resolveChromeBands`/`pageNumberBand` resolver (10 tests). Evidence: 122 pagination tests pass, typecheck clean, biome clean.
- 2026-05-29: **PR-C DONE** (branch `work/pagination-suite-c-modal`). Settings modal + live page setup + chrome render. Browser-verified via dev-browser (headless Chromium + template dev server on :3000).
  - Package: `resolvePageSetupChromeOptions` (header/footer page-number bands), overlay reads page setup REACTIVELY via `useEditorValue` (fixed a React-Compiler stale-memoized-read bug), geometry-signature watcher via `useEditorSelector` recomputes on page/margins/chrome change but NOT per keystroke (preserves CR#442 perf gate), `pageSetupFromValue`/`pageNumberAlign` helpers.
  - **Bug fixed (browser-caught):** `usePluginOption(plugin,'chrome')` threw `OPTION_UNDEFINED` for the bare demo plugin → declared a `chrome` default. (The `/editor` route worked because PaginationKit configures chrome; the bare `/dev/pagination2` was broken.)
  - Template: `PageSetupDialog` (margins/page-size/units/page-number/footnote toggle/print button) + `/dev/pagination2` rewritten to register `PageSetupPlugin`, seed a `page_setup` node, drive the desk width/padding from page setup, dotted breaks.
  - Evidence: 127 pkg tests pass, pkg+template typecheck clean, biome clean. Browser: modal reflows engine (3↔13 breaks on margin change), footer page numbers render ("Page 1 of 4" ×4), break style `dotted`, US Letter+inches default (816px), config persists on the `page_setup` node.
- Architecture note: runtime source = page_setup NODE (persistence) → overlay/host read it reactively; the node is skipped in pagination. No app-level option-sync needed.
- 2026-05-29: **DEPLOYED PR-A..C** to Cloudflare → https://plate-playground.cicero-im.workers.dev (/dev/pagination2 modal demo, /editor main). Production-verified via dev-browser (816px Letter, dotted breaks, modal reflow, footer page numbers).
- 2026-05-29: **PR-D DONE** (branch `work/pagination-suite-d-margins-mode`). Margins mode (pts 3/5/6).
  - Package: `ChromeContent.html` (rich inline) + `hasChromeContent`; chrome bands render rich html.
  - Template: `MarginsMode` — editable header/footer in the page margin zones, floating toolbar (bold/italic inline via execCommand + font/size/color region-level), click-outside-to-exit, "Edit margins" toggle.
  - Evidence: 128 pkg tests, pkg+tpl typecheck clean, biome clean. Browser: enter → type header → mirrors to all 4 pages ("DRAFT — Confidential"); bold applies (`<b>` in overlay); click-outside exits.
  - KNOWN POLISH (pt 8): on page 1, the editable band (margin zone) and the overlay header (anchored to first block top) both show → minor double-header while editing. Acceptable; candidate to suppress page-1 overlay header during margins mode.
- 2026-05-29: **PR-E DONE** (`971ad1c47`, branch `work/pagination-suite-e-footnotes`). FootnoteKit (template, mirrors registry) + insert-footnote button gated by the modal footnote toggle; calls `@platejs/footnote` `insertFootnote`. Endnote-style definitions at doc end, paginated as content. Verified: gating off→hidden/endnote→shown; insert adds ref+definition (41→44 nodes); pagination intact. Template-only (no changeset).
- 2026-05-29: **PR-F DONE** (`6e655f8ed`). `PrintStyles` injects `@page` size (preset/inches) + margins from page_setup + `@media print` UI hiding. Print-view button paginates to physical pages. Verified: `@page { size: letter; margin: 1in }` injected; headless PDF via print CSS = 4 pages. Template-only.
- **Remaining: PR-G — point #4** (modal + margins-mode buttons on the MAIN `/editor` fixed toolbar). NOTE: the `/dev/pagination2` demo already exposes these buttons + the full feature set "for ease of testing" (the literal intent of #4). Main-editor integration needs PageSetupPlugin in EditorKit + modal/margins state in the toolbar context + page-width desk — a larger follow-up.

## Final status (points)
- #1 modal ✓ · #2 dotted continuous ✓ · #3 margins-mode edit ✓ · #5 click-out exit ✓ · #6 fonts/styles ✓ · #7 doc-JSON metadata ✓ · footnotes toggle+insert ✓ · print view ✓ · Cloudflare deploy ✓
- #4 main-editor toolbar buttons: demo provides the testing surface; main-editor wiring = follow-up.
- #8 UX issues found+fixed: chrome OPTION_UNDEFINED throw; React-Compiler stale read; geometry-recompute gating. Open polish: page-1 double-header in margins mode.

### Source-of-truth RESOLVED
- The playground **deploys from the TEMPLATE directly**: `templates/plate-playground-template/src/{app/dev/pagination2,components/editor/{editor-kit,plugins/pagination-kit}}`. Commit `14686c6ac` edited the template directly with explicit user authorization ("Overrides the CI-controlled-templates rule"); deployed to `plate-playground.cicero-im.workers.dev/editor`. So UI wiring (modal, toolbar buttons, demo) goes in the TEMPLATE; package changes flow in via `vendor:pagination` (build pagination → copy dist into template).
- shadcn primitives: `apps/www/src/components/ui/` (template has its own under its `src/components/ui/`). No `switch` component yet (use a toggle/checkbox or add one).
- **Runtime blockers:** no dev server running; no debug Chrome on 127.0.0.1:9222. Verification hook forbids me starting `pnpm dev`. Need user to start the dev server (or authorize me).

### Open items needing user (non-blocking until reached)
- **Cloudflare deploy (PR-G)** needs the user's `wrangler` auth / CF account — I cannot deploy without it.
- **PR/check cadence:** repo `check` = full `lint && typecheck && test:all && test:slowest` (OOM-prone here). Plan: verify each PR at package scope; run `check:push` / open GitHub PRs at checkpoints unless told otherwise.
