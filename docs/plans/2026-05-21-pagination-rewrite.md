# Pagination rewrite — borrow premirror ideas (Slate)

**Goal:** Complete rewrite of `@platejs/pagination` (Slate), borrowing premirror's
deterministic derived-layout ideas for **page counting/measurement** and
**presentation**. Branch: `codex/pagination-premirror-ideas`. premirror cloned at
`../premirror`.

**Mandate:** User authorized a complete redo, "ensuring no detail is left behind."

## Core architectural shift
- **Current (model-mutating):** wrap root content into `page` nodes; a React
  `PaginationCoordinator` measures real DOM (offsetTop/offsetHeight) and
  `moveNodes` blocks between pages (`reflowEngine.ts`), splitting oversized
  blocks via `ReactEditor.toDOMRange` binary search. Mutates the doc → fights
  other plugins (TrailingBlock normalization loop), pollutes the model with
  `page` nodes, undo-history hazards (mitigated via `withoutSaving`).
- **premirror (derived overlay):** PM owns the doc unchanged; composer takes a
  measured snapshot → deterministic layout (pages/frames/lines/runs) →
  React projects fragments into absolute-positioned page viewports. Document
  model never changes. (This is also where `main`'s `@platejs/pagination@0.0.0`
  "variant A render-time overlay + pretext height oracle" already went.)

## Current package inventory (to preserve/supersede — nothing left behind)
- `BasePaginationPlugin.ts` (333) — key `'pagination'`, node `page`
  (isElement/isContainer), `normalizeRootChildren` wrapping, `normalizeInitialValue`,
  `onNodeChange` re-wrap, `overrideEditor` (apply/normalizeNode), transforms:
  `togglePreview`, `setPageSize` (A4/Letter/Legal), `setMargins`, `toggleHeader`,
  `toggleFooter`, `withMutations`. Options: `documentSettings` (sizes/margins),
  `reflow` (enabled, debounceMs, maxPagesPerIdle, underflow, allowTextSplit,
  overflow/underflowThresholdPx, debug), `collaboration` (mode all/leader),
  `defaultBlockType`, `viewMode` (paginated/continuous).
- `reflowEngine.ts` (418) — `reflowPageBoundary` (overflow push / underflow pull,
  hysteresis), `findOverflowSplitIndex` (binary search + non-monotonic linear
  fallback), `splitOversizedBlock` (text split via toDOMRange).
- `PaginationCoordinator.tsx` (212) — dirty-page loop, idle scheduling, leader gating.
- `registry.tsx` — `PaginationRegistryProvider` + page DOM registry.
- `PageElement.tsx` — renders page box (paginated white A4 + shadow / continuous),
  bottom-margin page number (just added).
- `internal/`: `runtime.ts` (dirty set + microtask notify), `scheduleIdle.ts`
  (SSR-safe ric), `editorRegistry.ts` (WeakMap runtime + mutating flag),
  `PaginationAboveEditable.tsx` (provider + coordinator).
- `leaderElection.ts` (always/awareness), `yjs/YjsIntegration.tsx`.
- Tests: ~2621 lines across 12 files.

## Recent fixes already landed (PR #405 / #406 — folder-pick lineage)
- Literal `'pagination'` key (KEYS.pagination unreleased in published utils).
- Single shared provider+coordinator subtree (reflow reads registry).
- Page number in bottom margin.
- Template: drop TrailingBlock conflict; rely on package auto-mount.

## Research (in flight — 4 agents on premirror)
1. composer engine (page flow/counting, line breaking, widow/orphan, determinism)
2. core + measurement (page specs, pretext height oracle, snapshot, LayoutOutput)
3. react presentation (page chrome viewports, absolute positioning, decorations)
4. design docs (architecture/rationale, API, policies, testing strategy)

## DECISION: Full premirror-style overlay (user-chosen)
Document model NEVER changes (no `page` nodes). One Slate `Editable`; pages are a
derived render projection. Kills the TrailingBlock normalization conflict + model
pollution + undo hazards entirely.

## Synthesized design (from 4 premirror research agents)
Pipeline (adapted to Slate, DOM as measurement source):
```
Slate value → snapshot(flat blocks + stable ids + slate paths)
            → measure (real DOM block heights, cached) → MeasuredSnapshot
            → composeLayout(pure, deterministic) → LayoutOutput
            → render overlay (page chrome + projected content) + mapping
```

### Layout contract (`src/layout/types.ts`) — mirror premirror, Slate-flavored
- `PageSpec { widthPx, heightPx, preset? }`; presets A4 `794×1123`, Letter `816×1056` (96dpi).
- `PageMargins { topPx,rightPx,bottomPx,leftPx }` (default 96 = 1in). Content frame = page − margins.
- `LayoutPolicies { widowLinesMin:2, orphanLinesMin:2, keepWithNextEnabled:true }`.
- `UnmeasuredSnapshot = { blocks: { id, path, type, attrs }[] }` (flat, top-level blocks).
- `MeasuredSnapshot` = blocks + `{ heightPx, lineHeightPx, lineCount }` (DOM-measured, cached by id+content+width).
- `LayoutOutput = { pages: PageLayout[]; mapping: MappingIndex; metrics }`.
  - `PageLayout { index, spec, frames: FrameLayout[] }`
  - `FrameLayout { bounds: Rect; fragments: BlockFragment[] }`
  - `BlockFragment { blockId, fragmentIndex, slateRange{path,offsetStart,offsetEnd}, y, height, breakReason? }`
  - `BreakReason = 'block_overflow' | 'manual_break' | 'keep_with_next' | 'widow_orphan'`
  - `MappingIndex { pathToPage(path)→pageIndex; ... }` (Slate path ↔ page/fragment).
- Use **measured per-line heights** (not premirror's uniform lineHeightPx grid) — we have real DOM.

### compose (`src/layout/compose.ts`) — PURE, DOM-free, deterministic
Block-level fill (Slate has no runs): accumulate `currentY` from measured block
heights against `frame.height`; flush page when a block overflows. Port
premirror's `linesThatFitFirstFragment` widow/orphan arithmetic at block-line
granularity (lineCount ≈ round(height/lineHeight)); keep-with-next look-ahead;
manual break via block attr. Emit `breakReason` per boundary. Same input →
identical output (snapshot-tested).

### measure (`src/measure/`)
Measure each top-level block's rendered height + line height from a hidden
measurement container (page content width), cache by `{blockId, contentHash, widthPx}`.
Only re-measure dirty blocks (derive dirty set from Slate ops).

### react overlay (`src/react/`)
- Page-chrome surfaces: absolute white pages (paper recipe `boxShadow 0 2px 12px rgba(15,23,42,.12)`,
  `1px solid #e5e7eb`, gray desk), `getPageGeometry()` → per-page {left,top},
  single/spread modes, gap constant.
- Content projection: single `Editable`; blocks visually placed per layout
  (start with vertical spacers/translateY aligning block tops to page frames;
  full glyph-projection is the aspirational endpoint).
- Margin chrome: page numbers / headers / footers anchored to page box + margin insets.
- Selection projection via mapping (later phase).

### Public API (keep stable where sane)
`PaginationPlugin` (auto-mounts overlay), options `{ page, margins, typography,
policies, viewMode }`, transforms `setPageSize/setMargins/togglePreview/
toggleHeader/toggleFooter`. Drop node-wrapping + reflowEngine + registry-move logic.

## Phased build (TDD, stacked PRs)
- **P1 ✅ DONE** — `layout/types.ts` (contract) + `layout/compose.ts` (pure
  `composeLayout`): DOM-free, deterministic, breakReasons + widow/orphan +
  keep-with-next + manual break + oversized split. 10 tests green.
- **P2 ✅ DONE** — `layout/snapshot.ts` (`buildSnapshot`): Slate value → flat
  block snapshot, stable content-based ids, atomic/keepWithNext/breakBefore
  hints. 6 tests green. (typecheck + lint clean for both.)
- **P3 (next): DOM measurement** — measure block heights/lineHeight from a
  hidden container at content width → `MeasuredSnapshot`; cache by
  `{id, contentHash, widthPx}`; dirty-set re-measure. Needs browser/jsdom seam.
- **P4 ✅ DONE (overlay engine + first renderer; verified live in agent-browser)** —
  `react/geometry.ts` (getPageGeometry/getBlockPlacements, pure + tested),
  `react/domMeasure.ts` (pure-DOM MeasureFn via `[data-slate-node=element]`
  children — no slate-react), `react/alignContent.ts` (page-start CSS spacers,
  no model mutation), `react/index.ts` (clean `@platejs/pagination/react` entry
  re-exporting the slate-react-free pipeline). Demo route renders white A4 page
  chrome + single continuous Editable + spacer alignment + page numbers.
  Verified: 4 pages, content flows across page boxes, clean boundaries. 149 tests.
  NOTE: apps/www dev is unusable (pre-existing globals.css:8504 Turbopack-dev
  PostCSS error 500s all routes) — verified via the playground template dev
  (clean CSS) instead.
- P5: selection/caret mapping (slatePath↔layoutPoint) + headers/footers.
- P6: migrate template/demo, delete node-wrapping + reflowEngine, redeploy + browser verify.

## Status
Foundation (P1+P2) on branch `codex/pagination-premirror-ideas`, uncommitted.
The deterministic core (snapshot → compose) is complete and tested headlessly.
Remaining P3–P6 are larger; P4 overlay renderer is the research-grade frontier.

## Test strategy (adopt premirror's)
Fixture tiers smoke/core/stress with declared expected page count + break events;
determinism gate (same input → identical LayoutOutput); semantic assertions paired
with snapshots; pinned typography for measurement tests.
