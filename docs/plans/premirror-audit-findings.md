# Premirror → Plate Pagination Translation Audit

## Summary

Premirror operates at **text-run granularity** (per-styled-segment text extraction, per-character width measurement, word-boundary line breaking). Our adaptation operates at **top-level block granularity** (block heights, estimated line counts). This is not a refinement — it's a fundamental modelshift that loses 6 layers of fidelity premirror's contracts require. Additionally, we lack premirror's bidirectional position mapping, dirty-range incremental invalidation, and decoration-projection rendering.

---

## Findings (ranked by severity)

### 🔴 P0 — Run-level fidelity entirely lost (model collapse)

**What premirror does:**
- Snapshot extracts text at the `StyledRun` level — each mark-span (bold, italic, code, link) becomes its own run with `text`, `font`, `marks`, and `pmRange` (`premirror/core/src/index.ts:57-64`).
- Each run is measured individually via Pretext, producing `widthPx` (`premirror/prosemirror-adapter/src/index.ts:355-390`).
- The composer uses per-run widths to do real line-filling — accumulating runs until content width overflows, respecting word boundaries (`premirror/composer/src/index.ts:349-506`).
- `LayoutOutput` preserves per-run coordinates (`PlacedRun.x`, `PlacedRun.width`) and per-line `pmRange` (`premirror/core/src/index.ts:97-112`).

**What we did:**
- `UnmeasuredBlock` has NO text content, NO runs, NO per-character measurement (`pagination/src/layout/types.ts:80-87`).
- `MeasuredBlock` stores only `heightPx`, `lineHeightPx`, `lineCount` (`pagination/src/layout/types.ts:48-69`).
- `snapshot.ts` builds blocks from Slate node types/paths/hints only — zero text extraction (`pagination/src/layout/snapshot.ts:59-76`).
- `measure.ts` reads DOM `offsetHeight` → divides by line-height → calls it line count (`pagination/src/measure/measure.ts:39-43`).
- Our `BlockFragment` has NO per-line coordinate information — just `y`, `heightPx`, `lineStart`, `lineCount` (`pagination/src/layout/types.ts:105-120`).

**Why it's broken:**
- We lost the ability to do any text-level layout: selection placement, caret positioning, hit-testing, or per-character rendering within blocks.
- The `lineCount = Math.round(heightPx / lineHeightPx)` approximation (`pagination/src/measure/measure.ts:39-43`) is only correct for monospaced content with uniform line-height. For mixed fonts, inline elements, or any non-rectangular block, it produces wrong line counts and wrong page breaks.
- premirror's `PlacedRun` precision enables precise cursor/selection projection (`premirror/react/src/index.tsx:265-321`). Ours can only approximate.

**Correct Slate approach:**
Slate's equivalent of "runs" are text leaves with marks. A proper adaptation would:
1. Extract leaf-level text + marks from Slate nodes (Slate's equivalent of ProseMirror marks).
2. Measure leaf widths via Canvas `measureText` or a hidden measurement DOM (Slate doesn't have Pretext, but Canvas API or layout-next-line equivalents exist).
3. Store measured leaf widths analogously to `MeasuredRun`.
4. Use those widths in line-filling (same algorithm as premirror's `breakBlockIntoLineDrafts`).

---

### 🔴 P1 — No bidirectional pmPos ↔ layout mapping (controller blindness)

**What premirror does:**
- `MappingIndex` has two precise functions (`premirror/core/src/index.ts:141-144`):
  - `pmPosToLayout(pmPos) → LayoutPoint | null` — maps any document position to `{pageIndex, frameIndex, fragmentIndex, lineIndex, offsetInLine}`.
  - `layoutToPmPos(point) → number | null` — reverse map.
- The mapping is built during composition from `LineRef` records sorted by `pmFrom` (`premirror/composer/src/index.ts:556-598`).
- The `LayoutOutput` includes the mapping (`premirror/core/src/index.ts:162-166`).
- The React layer uses mapping implicitly through `collectRectsForPmRange` to project selection rectangles into page coordinates (`premirror/react/src/index.tsx:265-321`).

**What we did:**
- Our `MappingIndex` only maps `blockIndex → FragmentRef[]` (`pagination/src/layout/mapping.ts:18-32`):
  - `fragmentsOfBlock(blockIndex)`
  - `pageOfBlock(blockIndex)`
  - `fragmentOfBlockLine(blockIndex, lineIndex)` — closest thing to position mapping, but works at line granularity within a single block.
- NO `pmPosToLayout` counterpart. NO `layoutToPmPos`. NO document-level position resolution.
- `LayoutOutput` does NOT include the mapping (`pagination/src/layout/types.ts:138-141`).

**Why it's broken:**
- Cannot answer "where is cursor position 42?" (the fundamental question for editing).
- Cannot reverse-resolve a click on a page to a document position.
- `useProjectedSelection` in premirror (`premirror/react/src/index.tsx:328-343`) uses layout iteration with precise per-line `pmRange` matching. Our equivalent doesn't exist — there's no way to project a Slate selection range onto page coordinates at all.
- The pagination engine is blind to document positions; it only knows about blocks.

**Correct Slate approach:**
- During composition, accumulate `{path, offset}` → `{pageIndex, frameIndex, fragmentIndex, lineIndex, offsetInLine}` refs, analogous to premirror's `LineRef` (`premirror/composer/src/index.ts:547-554`).
- Build a forward map from Slate `Point` to `LayoutPoint`.
- Build a reverse map from `LayoutPoint` to Slate `Point`.
- Include mapping in `LayoutOutput`.

---

### 🔴 P2 — Clone-based split rendering is a fragile hack vs premirror's decoration projection

**What premirror does:**
- Design principle: "Content fragments are expected to be positioned by ProseMirror decorations, not a duplicated text layer" (`premirror/react/src/index.tsx:151-154`).
- `PremirrorPageViewport` stacks page surfaces (static `<div>` with white background + border) and overlays a single `contenteditable` editor with `pointer-events: none` wrapper → `pointer-events: auto` on the editor surface (`premirror/react/src/index.tsx:239-261`).
- The editor content is NOT duplicated. The layout is purely visual — page surface divs with transparent editor overlay. The single editor scrolls continuously with page gaps, and decorations reposition content onto pages.

**What we did:**
- `computeSplitPlan` detects blocks that span pages and plans clipped clones (`pagination/src/react/splitClones.ts:47-86`).
- `renderSplitClones` reads live DOM with `getBoundingClientRect()`, `scrollHeight`, and `Range.getClientRects()` (`pagination/src/react/splitClones.ts:130-208`).
- For each split block, the live block is clipped with `maxHeight` + `overflow: hidden` to show only the first page's portion, and subsequent pages get read-only DOM clones with `overflow: hidden` + `translateY` to reveal the right slice (`pagination/src/react/splitClones.ts:88-120`).
- Clones strip `contenteditable` attributes (`pagination/src/react/splitClones.ts:107-110`).
- `collectLineBottoms` uses `Range.getClientRects()` to find visual line boundaries (`pagination/src/react/splitClones.ts:211-232`).
- `alignContentToLayout` applies `margin-top` spacers to push page-starting blocks down (`pagination/src/react/alignContent.ts:56-69`).

**Why it's broken:**
1. **Layout thrashing**: `renderSplitClones` reads `getBoundingClientRect()` (forces layout), then writes `maxHeight`, then reads `scrollHeight`. This is a classic forced-synchronous-layout pattern that tanks performance.
2. **Stale measurements**: The live block may already be clipped from a previous render cycle, making `scrollHeight` potentially inaccurate if the browser hasn't reflowed yet.
3. **Read-only clones can't be edited**: If the user clicks a cloned portion, it's inert. This creates a UX dead zone on every page after page 1 for split blocks.
4. **Visual seams**: The clone uses `overflow: hidden` with `translateY` — pixel rounding, font metrics, and subpixel shifts can create visible 1px gaps or overlaps at fragment boundaries.
5. **DOM duplication cost**: Each split block's clone clones the entire block DOM subtree (potentially large for complex blocks).
6. **Fragile line detection**: `collectLineBottoms` deduplicates rect bottoms within 1px tolerance (`pagination/src/react/splitClones.ts:222-224`), which breaks at high DPIs or with mixed font sizes.

**Correct Slate approach:**
- Follow premirror's model: a single continuous editable flowing through stacked page surface divs.
- Use CSS to visually separate pages, not DOM cloning.
- The editor's content naturally fills pages as the user scrolls. No content duplication.
- For split blocks, the editor's built-in overflow scrolling handles fragment visibility.

---

### 🟡 P3 — No dirty-range incremental invalidation

**What premirror does:**
- `PremirrorInvalidationState` tracks `{from, to}` dirty document ranges (`premirror/prosemirror-adapter/src/index.ts:49-52`).
- A `Plugin` automatically derives invalidation from transactions via `tr.docChanged` → full range, or explicit `PREMIRROR_META_KEY` metadata (`premirror/prosemirror-adapter/src/index.ts:53-81`).
- `getInvalidationRange(state)` exposes it to consumers (`premirror/prosemirror-adapter/src/index.ts:437`).
- The react hook `usePremirrorEngine` receives `previousLayoutOverride` — this is the seam for passing a prior layout so the composer can skip recomposing unchanged content (`premirror/react/src/index.tsx:34-35`).

**What we did:**
- `measureSnapshot` caches by `block.id + width` key (`pagination/src/measure/measure.ts:53-58`).
- But there is NO invalidation by document position. Every edit triggers a full `buildSnapshot` + `measureSnapshot` + `composeLayout` pipeline.
- No Plugin or equivalent for tracking changed positions in the Slate document.
- The cache is keyed by `block.id` which is content-hash based, so ANY text change in a block busts the entire block cache.

**Why it's broken:**
- premirror's dirty-range allows: (a) skip re-measuring blocks outside the dirty range, (b) skip re-composing pages before the dirty range. Ours re-runs the entire pipeline on every keystroke.
- For large documents (100+ pages), this is O(n) per edit vs premirror's O(dirty_range).
- The `id` hash-based cache key changes whenever the block's text content changes, making the cache a write-through pattern with no incremental benefit.

**Correct Slate approach:**
- Slate operations carry path information — track which top-level block paths were modified in the current operation batch.
- Only re-measure and re-compose blocks/pages within or after the changed paths.
- Annotate operations with invalidation metadata (similar to `PREMIRROR_META_KEY`).

---

### 🟡 P4 — Line-breaking is estimated, not measured

**What premirror does:**
- `breakBlockIntoLineDrafts` performs real line-filling: iterates runs, accumulates width, breaks when content width exceeded, prefers word boundaries (`premirror/composer/src/index.ts:349-506`).
- `fixWordBoundarySplits` handles word-boundary corrections across line boundaries (`premirror/composer/src/index.ts:300-347`).
- `splitPlacedRunAtWordBoundary` splits a run at a word boundary for reflow (`premirror/composer/src/index.ts:254-298`).
- Each run has individually measured width via Pretext (`premirror/composer/src/index.ts:85-112`).
- `pushPlacedSegment` creates `PlacedRun` with precise x-coordinate from accumulated width (`premirror/composer/src/index.ts:202-223`).

**What we did:**
- `linesToPlace` divides remaining space height by line height (`pagination/src/layout/compose.ts:31-47`).
- No word-boundary awareness. No per-character width accumulation. No line-filling.
- `placeBlock` splits by uniform `lineHeightPx` chunks (`pagination/src/layout/compose.ts:87-163`).
- The assumption is that every line of a block has the same height and the same internal structure.

**Why it's broken:**
- False assumption: all lines within a block have uniform height. Reality: inline images, superscript, mixed font sizes, and inline code blocks produce varying line heights.
- No orphan/widow protection at the correct granularity — premirror counts actual lines; we count estimated lines.
- A block with 3 long text lines might actually wrap to 6 visual lines. Our `lineCount = Math.round(heightPx/lineHeightPx)` will estimate 3 (wrong).

**Correct Slate approach:**
- Use Canvas `measureText` or an off-screen DOM to measure individual leaf widths.
- Implement line-filling with the same word-boundary preference algorithm as premirror.
- Store per-line coordinates (not just per-fragment).

---

### 🟡 P5 — Missing MappingIndex in LayoutOutput (contract violation)

**What premirror does:**
- `LayoutOutput` includes `mapping: MappingIndex` as a required field. Every consumer of `LayoutOutput` gets bidirectional position resolution (`premirror/core/src/index.ts:162-166`).

**What we did:**
- `LayoutOutput` has NO mapping field (`pagination/src/layout/types.ts:138-141`).
- `buildMappingIndex` is a separate function that consumers must call independently (`pagination/src/layout/mapping.ts:34`).
- `projection.ts` calls `buildMappingIndex` internally and discards it — each call rebuilds the index (`pagination/src/layout/projection.ts:31-36`).

**Why it's broken:**
- Repeated index rebuilds (`fragmentRects` and `blockLinePosition` both call `buildMappingIndex(layout)`) — O(fragments) work wasted on every call.
- Consumers can't inspect the mapping without rebuilding it.
- Diverges from premirror's contract: layout output should be self-contained.

**Correct Slate approach:**
- Include `mapping: MappingIndex` in `LayoutOutput`.
- Build it once during `composeLayout` and freeze it.

---

### 🟠 P6 — No TypographyConfig / font model

**What premirror does:**
- `TypographyConfig` specifies `defaultFont`, `defaultLineHeightPx`, `tabSize` (`premirror/core/src/index.ts:26-31`).
- Fonts are resolved per-run: bold → weight 700, italic → style italic, code → monospace family (`premirror/prosemirror-adapter/src/index.ts:105-114`).
- `parseFontSizePx` extracts font size from the font string (`premirror/prosemirror-adapter/src/index.ts:99-103`).

**What we did:**
- No `TypographyConfig`. No font resolution. No per-leaf font measurement.
- `domMeasure.ts` reads `computedStyle.lineHeight` from DOM (`pagination/src/react/domMeasure.ts:19-27`).
- No concept of what font is being used or how marks affect it.

**Why it's broken:**
- The line height used for line-count estimation comes from a single DOM element's computed style, which may not represent every leaf in a mixed-style block.
- premirror's font resolution enables correct measurement even before DOM exists (offline/pre-render layout). Ours can only measure after DOM render.

---

### 🟠 P7 — No obstacle / slot selection support

**What premirror does:**
- `BandObstacle` represents items that carve into the content frame (images, floats, columns) (`premirror/core/src/index.ts:183-188`).
- `usableSlotForBand` computes the leftmost horizontal slot in a content band, accounting for obstacles (`premirror/composer/src/index.ts:159-181`).
- `mergeIntervals` merges overlapping obstacle intervals for slot computation (`premirror/composer/src/index.ts:138-153`).
- `slotSelectionPolicy` in policies (`single_slot_flow` / `multi_slot_fill`) (`premirror/core/src/index.ts:32-38`).

**What we did:**
- No `BandObstacle`. No slot computation. No `slotSelectionPolicy`.
- Content is always full-width within the content frame.

**Why it's missing:**
- Future features (float images, multi-column layout, side-notes) depend on this.
- The contract simply doesn't exist in our adaptation.

---

### 🟠 P8 — Spacer alignment is self-referential and fragile

**What premirror does:**
- No spacers. Content positioning is driven by layout coordinates projected through decorations.
- `PremirrorPageViewport` stacks page divs with absolute positioning, editor overlay on top.

**What we did:**
- `alignContentToLayout` applies CSS `margin-top` to push page-starting blocks to their page's content-frame top (`pagination/src/react/alignContent.ts:56-69`).
- `computePageStartSpacers` computes the required gap = contentHeight - prevPageBottom + bottomMargin + pageGap + topMargin (`pagination/src/react/alignContent.ts:18-50`).

**Why it's fragile:**
- The spacer depends on the *measured heights* from the previous measurement cycle. If those heights change (CSS cascade, font loading, reflow), the spacer becomes stale.
- `domMeasure` reads `offsetHeight` which includes margins, but the comment says "marginTop is applied as spacer, so reading margins here would double-count" (`pagination/src/react/domMeasure.ts:39-41`). This means the spacer height computation and the measurement are circular: the spacer changes the height, which changes the measurement, which changes the spacer.
- The `previous.fragments[previous.fragments.length - 1]` approach picks the last fragment's computed y, but y is from the *layout* model, not the *actual* rendered position (`pagination/src/react/alignContent.ts:34-37`).

---

### 🟢 P9 — Determinism gap in clone rendering

**What premirror does:**
- `composeLayout` is pure — same inputs → same outputs (verified by test: `premirror/composer/src/index.test.ts:56-62`).
- `usePremirrorEngine` wraps it in `useMemo` for React determinism (`premirror/react/src/index.tsx:55-74`).

**What we did:**
- `composeLayout` is pure (`pagination/src/layout/compose.ts`).
- BUT `renderSplitClones` reads live DOM values (`getBoundingClientRect`, `scrollHeight`, `Range.getClientRects`) — these vary with browser state, fonts, zoom, OS font rendering, etc. (`pagination/src/react/splitClones.ts:158-160`, `pagination/src/react/splitClones.ts:216-226`).
- `alignContentToLayout` writes `marginTop` to DOM elements — a mutation that can trigger reflow and affect subsequent measurements.

**Why it matters:**
- The layout engine is deterministic but the rendering layer injects non-deterministic DOM reads. Two identical editor states can produce visually different page splits due to timing-dependent DOM measurements.
- This violates premirror's "deterministic pagination" design constraint (`premirror/docs/design-proposal.md:19`).

---

### 🟢 P10 — No measurement-caching seam across re-renders

**What premirror does:**
- `MeasuredDocumentSnapshot.measuredRuns` is a flat record keyed by `runId` (`premirror/core/src/index.ts:85-87`).
- The react hook passes `previousRef` to the composer via optional `previousLayoutOverride` (`premirror/react/src/index.tsx:62-63`).
- This seam allows the composer to reuse previously measured and computed data for unchanged parts of the document.

**What we did:**
- `measureSnapshot` accepts a `cache?: MeasureCache` (`Map<string, {key, metrics}>`) (`pagination/src/measure/measure.ts:28-34`).
- But there's no mechanism to pass a previous layout to the composer for incremental re-composition.
- `previousLayoutOverride` equivalent does not exist in our code.

**Why it matters:**
- premirror's design allows skipping entire pages of re-composition when only a later block changed. Ours re-composes the entire document from scratch.

---

## Summary Table

| Severity | Finding | premirror file:line | Our file:line | Gap |
|----------|---------|-------------------|---------------|-----|
| P0 | Run/text fidelity lost | `core/src/index.ts:57-64` | `layout/types.ts:80-87` | No text extraction, no per-run measurement |
| P1 | No bidirectional pmPos↔layout mapping | `core/src/index.ts:141-144`, `composer/src/index.ts:556-598` | `layout/mapping.ts:18-32` | Only block↔fragment; no doc-position precision |
| P2 | Clone rendering vs decoration projection | `react/src/index.tsx:151-154` | `react/splitClones.ts:130-208` | DOM duplication + overflow clipping instead of decorations |
| P3 | No dirty-range invalidation | `prosemirror-adapter/src/index.ts:49-81` | (none) | Full recomposition every edit |
| P4 | Line-breaking estimated not measured | `composer/src/index.ts:349-506` | `layout/compose.ts:87-163` | height÷lineHeight instead of real line-filling |
| P5 | MappingIndex missing from LayoutOutput | `core/src/index.ts:162-166` | `layout/types.ts:138-141` | Contract divergence |
| P6 | No TypographyConfig / font model | `core/src/index.ts:26-31`, `prosemirror-adapter/src/index.ts:99-114` | (none) | No font resolution per leaf |
| P7 | No obstacle / slot selection | `core/src/index.ts:183-188`, `composer/src/index.ts:159-181` | (none) | Missing contract for multi-column, floats |
| P8 | Spacer alignment self-referential | (doesn't use spacers) | `react/alignContent.ts:56-69`, `react/domMeasure.ts:39-41` | Circular dependency between spacer and measurement |
| P9 | Determinism gap in clone rendering | `composer/src/index.test.ts:56-62` | `react/splitClones.ts:158-160` | Live DOM reads introduce non-determinism |
| P10 | No previous-layout seam | `react/src/index.tsx:34-35`, `react/src/index.tsx:62-63` | `measure/measure.ts:28-34` | Full recompose every time, no incremental path |
