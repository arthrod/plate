# Pagination Exploratory Research

**Date:** 2026-05-22
**Scope:** `@platejs/pagination` — derived overlay pagination for Slate editor

---

## Part 1: Blocks Taller Than One Page — Alternatives

### Current State (Option C: Place-Whole + Overflow)

**Code:** `packages/pagination/src/layout/compose.ts:63-81`

The composer treats top-level Slate blocks as atomic placement units. Logic:
- If block fits remaining space → placed on current page
- If block exceeds remaining space but fits a full page → moved to next page
- **If block exceeds a full page → placed at top and overflows** (the problem)

```typescript
// compose.ts:67
if (b.heightPx > frameHeight - currentY && fragments.length > 0) {
  breakToNewPage('block_overflow');
}
// If still doesn't fit even on fresh page, placed anyway — no height guard.
```

The types DO anticipate splitting (`BlockFragment` has `fragmentIndex`, `lineStart`, `lineCount` — `packages/pagination/src/layout/types.ts:105-122`), but the compose logic doesn't split yet.

### Premirror Reference (Option B: Line-Level Splitting)

**Code:** `../premirror/packages/composer/src/index.ts:349-506, 666-771`

Premirror's composer works at **line granularity**:
1. `breakBlockIntoLineDrafts()` (L349): breaks block text into `LineDraft[]` — each line has `PlacedRun[]` with absolute x/width + `pmRange` for selection mapping
2. `linesThatFitFirstFragment()` (L512-541): decides how many lines fit with widow/orphan protection
3. The `while (lineCursor < drafts.length)` loop (L695-770) creates multiple `BlockFragment`s per block, each with `lines: LineBox[]`

Each `LineBox` carries absolute positioning (`y`, `height`) and `pmRange`, enabling selection projection via `buildMappingIndex` (L556-598) → `pmPosToLayout` / `layoutToPmPos`.

Premirror's rendering (`../premirror/packages/react/src/index.tsx:156-263`) uses:
- Absolutely-positioned page surfaces (white boxes with shadows)
- A single editor overlay (`pointerEvents: "none"` container, `pointerEvents: "auto"` on inner surface)
- Editor is positioned at (0,0) of the page stack — ProseMirror decorations handle per-page positioning
- `useProjectedSelection` (L328-344) maps PM selection to layout-space rects for a projected caret

### Alternative Approaches — Ranked Analysis

#### 🥇 #1 Composer Split + Overlay Clipping (Score: 9/10)

**What:** Modify `composeLayout` to actually split blocks that overflow, creating multiple `BlockFragment`s per block (leverages existing `fragmentIndex`/`lineStart`/`lineCount` fields in `types.ts:105-122`). The overlay page-chrome renderer applies `overflow: hidden` or `clip-path` per page frame to visually clip content at page boundaries. The editable DOM still has the whole block — only the visual overlay clips it.

**Why it works for editable Slate:**
- Editable DOM unchanged — editing, selection, cursor all work natively
- Selection projection: `buildMappingIndex` (mapping.ts:34) already supports `fragmentOfBlockLine` — extend to map Slate `path+offset` to layout coordinates
- Pretext line measurement (pretext.ts:34-69) already gives us `MeasuredLine[]` with cursor ranges (`start`/`end: LineCursor` — segment+grapheme indices) — the raw material for precise split points

**Implementation complexity:** Medium (3-4 days)
- Phase 1: Gutter masks only (1d — hide overflow visually, no pipeline change)
- Phase 2: Add split logic to `composeLayout` (2-3d — premirror's `while (lineCursor < drafts.length)` pattern as reference)

**Visual fidelity:** Excellent — clean page breaks at line boundaries, no content bleed

---

#### 🥈 #2 Gutter Mask Overlays (Score: 8.5/10)

**What:** Add opaque absolutely-positioned divs between page frames that cover the overflow content. `pointerEvents: none` so typing works through them. This is purely visual — zero pipeline changes.

**Why first:** One day of work. Hides the ugly bleed. Buys time for the full split implementation.

**Limitations:** Content still overflows, just hidden. If a block is 2 pages tall with text in the bottom half, the text on page 2 is visually covered by the first page's gutter. Acceptable as a stopgap.

**Code shape:**
```tsx
// react/PaginationGutterMask.tsx — Rendered in afterEditable slot
{pages.map((_, i) => i < pages.length - 1 && (
  <div style={{
    position: 'absolute',
    left: 0,
    top: geometry.placements[i + 1].top - GUTTER_HEIGHT,
    width: geometry.width,
    height: GUTTER_HEIGHT,
    background: 'var(--pagination-gutter-bg, #f0f2f5)',
    pointerEvents: 'none',
    zIndex: 10,
  }} />
))}
```

---

#### 🥉 #3 Line-Level Fragment Clipping (Score: 8/10)

**What:** Same as #1 but split at line granularity using pretext's measured lines. The `measureTextLines()` function (pretext.ts:34-69) already returns `MeasuredLine[]` with `start`/`end` cursor positions — exactly what's needed for clean page breaks at line boundaries and for projected selection.

**Advantage over #1:** Clean break at the last complete line, no partial-line clipping. Works with the existing pretext pipeline.

**Extra work:** Need a line-start-to-Slate-offset mapping (the pretext cursor → Slate offset converter), which the pretext cursor types already support.

---

#### #4 Visual Fragments via Overlay Windows (Score: 7.5/10)

**What:** Create absolutely-positioned `div` elements with `overflow: hidden` on the overlay, each matching a page frame, positioned over the editable. Think "page-shaped windows" over the continuous editable scroll.

**Pros:** No pipeline changes, works with any content height.  
**Cons:** The editable spans across all "windows" — scrolling, selection, and cursor queries need to account for the visual split. The Slate editor's position-to-query methods (like `findEventRange`) would need to translate screen coordinates back through the overlay geometry to the underlying edit offset.

---

#### #5 Read-Only Clones (Score: 7/10)

**What:** Clone the overflow portion of a block into a read-only DOM fragment, displayed in a separate layer. The original editable DOM retains the full block.

**Pros:** Visual correctness. The clone sees the text but it's inert.  
**Cons:** Two DOM trees to keep in sync. If the user edits the block, the clone must update. Selection on the clone is impossible (by design), but that means the user can't click into the overflow portion to edit there — they must navigate via keyboard or scroll the editable.

---

#### #6 Extended Spacer Scheme (Score: 6.5/10)

**What:** We already use `margin-top` spacers (alignContent.ts:56-69) to push page-starting blocks into alignment. Extend this to insert spacer values that create total vertical separation between pages.

**Already implemented** — this is how the current pipeline works.  
**Can't solve alone:** Spacers push blocks down but don't split tall blocks. A 600px block on a 400px page will still overflow regardless of spacer values.

---

#### CSS-Only Approaches (Scores ≤4/10) — Why They Fail

| Approach | Score | Why it fails for editable |
|----------|-------|--------------------------|
| `break-inside: avoid/auto` | 4/10 | Only works in multicol or print contexts. Does nothing in normal flow. |
| `column-count` / `column-fill` | 3/10 | Splits into fixed-width columns, not pages. No way to control break positions per-block. Breaks cursor/selection. |
| CSS Regions (`flow-into`/`flow-from`) | 1/10 | Removed from spec. No browser support. |
| `@page { size: A4 }` + `page-break-after` | 3/10 | Print-only. Renders paginated in `@media print`, not on screen. |
| `container-type: size` | 2/10 | Can't query whether a block overflowed a page boundary — container queries don't expose "is content taller than container?" |
| `content-visibility: auto` | 2/10 | Offscreen optimization, not pagination. |
| `view-timeline` / scroll-driven animations | 2/10 | Can detect scroll position but not content-over-page-boundary events. |
| Canvas-based rendering | 3/10 | Loses all editability. You'd need to reimplement text input from scratch. |

**Fundamental reason CSS alone can't work:** Browsers do not paginate live editable DOM stream. Print pagination uses a separate layout pass that doesn't apply to on-screen rendering. CSS fragmentation properties (`break-*`, `column-*`) operate on static boxes, not `contenteditable` DOM where every keystroke reflows the tree.

### Recommended Path

| Phase | What | Time | Delivers |
|-------|------|------|----------|
| 1 | Gutter mask overlays (#2) | 1 day | No visual bleed → usable demo |
| 2 | Composer split logic (#1) | 3 days | Fragmented blocks with clean page breaks |
| 3 | Line-aligned clipping (#3) | 2 days | Precise line-boundary breaks + projected selection |

Total: ~6 days to production-quality pagination with clean page breaks.

---

## Part 2: Plugin Architecture — How `@platejs/pagination` Should Be Structured

### Plate's Plugin Architecture Conventions

#### Base (Slate/headless) vs React Split

**Convention:** Every plugin has a `Base*Plugin` (headless, `createSlatePlugin`) and a `*Plugin` (React wrapper, `createPlatePlugin`/`toPlatePlugin`).

**Pattern confirmed** in the subtask research. The React wrapper is a thin remap:

```typescript
// src/lib/BaseFooPlugin.ts (headless)
export const BaseFooPlugin = createSlatePlugin({
  key: 'foo',
  // Slate-level API, transforms, node definitions
  extendEditorApi: ({ editor }) => ({ foo: { doThing() {} } }),
  node: { isElement: true },
})

// src/react/FooPlugin.ts (React)
export const FooPlugin = toPlatePlugin(BaseFooPlugin, {
  render: {
    node: FooComponent,          // React render for this node type
    afterEditable: OverlayComponent, // React-only render slots
  },
  useHooks: ({ editor }) => {}, // React hooks
})
```

The base plugin is **pure, testable, non-React.** The React wrapper adds DOM-rendering concerns, hooks, and editor chrome.

#### Static Rendering Path

**Code:** `packages/core/src/static/plugins/ViewPlugin.ts` (copy handler), `serializeHtml` → `PlateStatic` component.

Static rendering (`pipeRenderElementStatic`) is for SSR/export — it renders a **non-interactive** HTML string from the editor value. It uses render slots (`aboveNodes`, `belowNodes`) but without any editor instance. This is where a `serializePaginationHtml` output would go (generating page-stamped HTML for export).

For pagination: static render could produce HTML with actual `<div class="page">…</div>` wrappers split at page boundaries — useful for PDF/print export. This is a **separate concern** from live editing.

#### Derived-Content Plugin Patterns

Plate has four established patterns for content not stored in the document model:

| Pattern | Example | File | How it works |
|---------|---------|------|--------------|
| **afterEditable overlay** | CursorOverlay | `packages/selection/src/react/CursorOverlayPlugin.tsx` | Renders in `afterEditable` slot, absolutely positioned, uses browser rects for layout |
| **External React hooks** | TOC sidebar | (TOC plugin — external hooks: `useTocSideBar`, `useTocController`) | Hooks consume editor state externally, render in separate React tree |
| **Inline void nodes** | Footnote references | (Footnote: `BaseFootnoteReferencePlugin` + `BaseFootnoteDefinitionPlugin`) | Void inline `<sup>` marks the position; definition lives in separate void block |
| **Leaf mark + editor override** | Suggestion | (Suggestion plugin: `withSuggestion` capture-remap) | Leaf marks carry derived metadata; editor `insertText`/`deleteBackward` overrides manage state |

**CursorOverlay is the closest analog for pagination** — it:
1. Uses `createTPlatePlugin` (`packages/selection/src/react/CursorOverlayPlugin.tsx:38`)
2. Renders nothing into the editable itself
3. Positions overlay elements via absolute coordinates derived from editor state
4. Uses `usePluginOption` for reactive state (`CursorOverlayPlugin.tsx:119`)
5. Override editor transforms to capture derived state (`setSelection` override at L66-78)

### Proposed Pagination Architecture

```
@platejs/pagination/
├── src/
│   ├── index.ts                      # Barrel — re-exports from lib/ + react/
│   ├── lib/                          # PURE — headless, no React, no DOM
│   │   ├── index.ts                  # Barrel
│   │   ├── BasePaginationPlugin.ts   # createSlatePlugin
│   │   ├── layout/
│   │   │   ├── compose.ts            # composeLayout (pure, block-level split)
│   │   │   ├── snapshot.ts           # buildSnapshot (Slate value → UnmeasuredSnapshot)
│   │   │   ├── mapping.ts            # buildMappingIndex (LayoutOutput → MappingIndex)
│   │   │   ├── projection.ts         # fragmentRects, blockLinePosition (pure)
│   │   │   └── types.ts              # All layout types, page specs
│   │   └── measure/
│   │       ├── measure.ts            # measureSnapshot (pure, MeasureFn injected)
│   │       └── pretext.ts            # measureTextLines, measureBlockHeight
│   │
│   └── react/                        # REACT layer — DOM, rendering, hooks
│       ├── index.ts                  # Barrel
│       ├── PaginationPlugin.ts       # toPlatePlugin(BasePaginationPlugin, {...})
│       ├── PaginationOverlay.tsx     # Page chrome + gutter masks (afterEditable)
│       ├── PageFrame.tsx             # Per-page frame with overflow:hidden clip
│       ├── domMeasure.ts             # createDomMeasure (DOM-backed MeasureFn)
│       ├── geometry.ts               # getPageGeometry, getBlockPlacements (stacked)
│       ├── alignContent.ts           # alignContentToLayout (margin-top spacers)
│       ├── usePagination.ts          # Main hook: snapshot→measure→compose→render
│       └── useProjectedSelection.ts  # Caret projection into page coordinates
```

### Component Placement in the Editor Tree

```
<PlateEditor>
  <Editor />                          {/* the editable DOM */}
  <PlateContent>
    {/* Slate blocks — only modified with margin-top spacers */}
    <Element data-slate-node="element" style="margin-top: 800px">...</Element>
    <Element data-slate-node="element">...</Element>
  </PlateContent>

  {/* afterEditable render slot — pagination overlay lives here */}
  <PaginationOverlay>                 {/* position: absolute; top: 0; pointer-events: none */}
    <PageFrame page={0}>              {/* position: absolute; overflow: hidden — clips content */}
      <PaginationPageChrome />        {/* white box, shadow, border */}
      <PaginationGutterMask />        {/* covers overflow at page bottom */}
    </PageFrame>
    <PageFrame page={1}>
      ...
    </PageFrame>
    <div style="pointer-events: auto">
      <ProjectedSelectionCaret />     {/* positioned caret visualization */}
    </div>
  </PaginationOverlay>
</PlateEditor>
```

Key design decisions:
- **afterEditable render slot** (`packages/core/src/lib/editor/SlateEditor.ts:87`): Overlay rendered as sibling to the editable, at same origin. Matches CursorOverlay pattern.
- **`pointer-events: none` on overlay container**: Content doesn't block typing. `pointer-events: auto` only on interactive overlay elements (premirror does this at `premirror/packages/react/src/index.tsx:247-256`).
- **The editable DOM is only modified via margin-top spacers** (alignContent.ts:56-69). No injected wrapper divs, no `contenteditable` changes.
- **Composes with other plugins**: any node-type plugin (bold, heading, etc.) renders normally inside the editable. Pagination only adds chrome outside it.

### Base Plugin API Shape

```typescript
// lib/BasePaginationPlugin.ts
export const BasePaginationPlugin = createSlatePlugin({
  key: KEYS.pagination,
  options: {
    page: A4_PAGE_PX,
    margins: DEFAULT_PAGE_MARGINS,
    policies: {
      widowLinesMin: 2,
      orphanLinesMin: 2,
      keepWithNextEnabled: true,
    },
    atomicTypes: ['table', 'img', 'hr'],
    keepWithNextTypes: ['h1', 'h2', 'h3'],
  },
})
  .extendApi(({ editor, plugin, type }) => ({
    pagination: {
      // Core pipeline (pure — used by both headless and React paths)
      buildSnapshot: (value?: Descendant[]) => buildSnapshot(value ?? editor.children, {...}),
      measureSnapshot: (snapshot, measureFn) => measureSnapshot(snapshot, measureFn, {...}),
      composeLayout: (measured, input) => composeLayout(measured, input),

      // Block-level pagination controls (transforms)
      toggleKeepWithNext: (path: Path) => { /* set node.keepWithNext */ },
      toggleBreakBefore: (path: Path) => { /* set node.breakBefore */ },

      // Selection projection (headless, no DOM)
      getPageOfBlock: (blockIndex: number) => number | null,
      getSelectionPage: () => number | null,
    },
  }))
  .overrideEditor(({ editor, tf }) => ({
    transforms: {
      // Keep insertBreak from breaking keepWithNext pairs
      insertBreak() {
        // ... preserve keepWithNext when breaking blocks
        tf.insertBreak();
      },
    },
  }));
```

### React Plugin API Shape

```typescript
// react/PaginationPlugin.ts
export const PaginationPlugin = toPlatePlugin(BasePaginationPlugin, {
  render: {
    afterEditable: PaginationOverlay,
    // aboveEditable could hold the spacer container if needed
  },
  useHooks: ({ editor, plugin }) => {
    // Main reactive pipeline
    const { layout, geometry, diagnostics } = usePagination({
      editor,
      plugin,
    });

    // Apply margin spacers on every layout change
    useLayoutEffect(() => {
      const editable = editor.getEditableElement();
      if (!editable || !layout) return;
      alignContentToLayout(editable, layout, input);
    }, [layout]);

    return { layout, geometry, diagnostics };
  },
});
```

### Public API Surface (What Consumers Import)

```typescript
// Plugin registration
import { PaginationPlugin } from '@platejs/pagination/react';

// Headless (non-React) path
import { BasePaginationPlugin } from '@platejs/pagination';
import { buildSnapshot, composeLayout, measureSnapshot } from '@platejs/pagination';

// React hooks
import { usePagination, useProjectedSelection } from '@platejs/pagination/react';

// Types
import type { LayoutOutput, PageLayout, BlockFragment } from '@platejs/pagination';

// Page specs
import { A4_PAGE_PX, LETTER_PAGE_PX } from '@platejs/pagination';

// Static rendering (future)
import { serializePaginationHtml } from '@platejs/pagination/static';
```

### Static Rendering Path (Future)

Following `packages/core/src/static/` patterns, add a `static/` export:

```typescript
// static/serializePaginationHtml.ts
// Uses pipeRenderElementStatic to produce page-wrapped HTML:
// <div class="page"><div class="page-content">...blocks...</div></div>
// No editor, no interactivity — for export/print/PDF
```

### How It Composes With Other Plugins

- **Normal node plugins** (bold, heading, list, etc.): No interaction needed. Pagination reads the Slate value via `editor.children`, runs the pipeline, and positions chrome outside the editable. Node rendering is unaffected.
- **Footnote plugin:** Footnote definitions (void blocks) would be treated as atomic blocks (placed whole, not split). Footnote references (inline void `<sup>`) are inside block text — split at their line position like any inline text.
- **Suggestion/comment plugin:** Leaf marks are transparent to pagination (the snapshot only reads text). The overlay doesn't intersect with mark rendering.
- **Table plugin:** Marked as `atomicType` — never split, placed whole. If taller than a page, overflows (until phase 2 split handles it).
- **Comment sidebar:** A separate afterEditable slot that stacks below the pagination overlay (or above it, depending on z-index layering).

### Why This Architecture

1. **Match Plate convention**: Base/React split is the established pattern. Pagination should follow it.
2. **Headless testability**: `composeLayout`, `buildSnapshot`, `measureSnapshot` are pure functions — testable with Jest, no browser needed.
3. **CursorOverlay precedent**: `afterEditable` render slot + absolute positioning is proven in Plate for derived visual content.
4. **No model mutation**: The document model stays clean. Pages are pure projection. This is the foundation the whole design rests on.
5. **Separate concerns**: `lib/` is the engine (layout, measurement), `react/` is the chassis (DOM, rendering, hooks). Each layer can evolve independently.
6. **Prefigures static rendering**: When pagination gets a `serializePaginationHtml`, the pure pipeline in `lib/` is directly reusable — the static path just swaps the render layer.
