# Pagination — Approach B (line projection, page boxes) implementation plan

**Decision:** implement **B** — premirror-style page-box pagination: one continuous
contenteditable, absolute page-chrome overlay, blocks split across pages at **line
boundaries** (pretext), content aligned into page boxes, and **selection projected**
across page boundaries. Full-fidelity, Word-class.

A junior dev proposed a "two modes" alternative (edit = continuous flow + faded
break-lines; print = heavy authoritative pass). We considered it; we are going
with B and pressure-testing that choice (two model reviews biased to B, pros/cons
pending). This plan is B.

`north-star reaffirmed: laws` (derived overlay; document model never mutates).

Builds on the green stack #408–#413 (scorch → pretext measure → place-whole compose).
**Note:** B reverses PR6's place-whole simplification — compose returns to
line-level fragmentation (now driven by real pretext lines, not the old estimate).

## The keystone risk (read first)

premirror's B positions split content with **ProseMirror decorations**
(`packages/react/src/index.tsx:153-154`: "Content fragments are positioned by
ProseMirror decorations, not a duplicated text layer"). **Slate cannot do this** —
Slate's `decorate` only styles existing ranges in place; it cannot relocate a
paragraph's tail onto another page box. So Slate-B substitutes:

1. **Line-boundary margin spacers** — to visually split a block across page boxes,
   inject computed `margin` at the exact line where the page breaks, pushing the
   remaining lines down to the next page's content-top (+ inter-page gap). The
   editable stays one DOM tree (native editing); the *visual* flow gains gaps at
   page boundaries, even mid-block.
2. **Projected selection** — because content now spans visual gaps, a Slate range's
   highlight/caret rects must be projected per page (premirror's
   `collectRectsForPmRange`, `react/index.tsx:265`), not left to the browser's
   native range rects (which would draw through the gap).

These two are B's hard parts and the bulk of the risk/effort.

## Architecture (footnote-style packaging)

```
packages/pagination/src/
  lib/                      # BASE — Slate/headless, no React, measurement INJECTED
    BasePaginationPlugin.ts # createTSlatePlugin; WeakMap layout registry (footnote pattern)
    registry.ts             # WeakMap<editor,{layout,dirty}>; dirty-on-apply, lazy rebuild
    snapshot.ts compose.ts mapping.ts projection.ts types.ts   # pure pipeline
  react/                    # REACT
    PaginationPlugin.tsx    # toPlatePlugin(Base); supplies pretext MeasureFn; useHooks(recompute)
    PaginationOverlay.tsx   # absolute page chrome (boxes, numbers, header/footer zones)
    alignFragments.ts       # NEW: line-boundary margin spacers (Slate substitute for PM deco)
    useProjectedSelection.ts# NEW: Slate range -> per-page screen rects (collectRectsForPmRange analog)
    domMeasure.ts pretext.ts geometry.ts
  static/                   # PRINT — serializeHtml + @page (authoritative export)
```

- **Base** owns the derived layout in a `WeakMap<SlateEditor,{layout,dirty}>`
  (footnote `lib/registry.ts` pattern): `editor.apply` override marks dirty on
  content mutations; layout is rebuilt lazily on read. Measurement is injected so
  base stays pure.
- **React** lifts via `toPlatePlugin`, provides the pretext/DOM `MeasureFn`, runs the
  pipeline on change, and renders: page chrome (`render.afterEditable`) + the
  positioning host (`render.aboveEditable`) + the spacer alignment + projected
  selection.
- **Static** path renders `layout.pages` as fixed-size containers with `@page` +
  `break-inside: avoid` for print/PDF.

## Phased build (TDD, stacked PRs on #413)

- **PR-B1 — compose: line fragmentation.** Reinstate splitting at line granularity,
  driven by `measureTextLines` line counts (not the removed estimate). A splittable
  block → `BlockFragment[]` (`lineStart`/`lineCount`/`y` per page); atomic blocks
  place whole; manual breaks + keepWithNext preserved. *Pure, TDD:* compose.spec
  asserts fragment boundaries for a block spanning N pages.
- **PR-B2 — measure: per-line offsets.** Expose cumulative line-bottom offsets per
  block (from pretext) so compose knows the exact mid-block break Y. *Pure, TDD.*
- **PR-B3 — projection: fragment rects.** `fragmentRects` maps each fragment to its
  absolute page-frame rect (exists; verify against line fragments). *Pure, TDD.*
- **PR-B4 — React: page chrome overlay.** `PaginationOverlay` + host: absolute white
  pages + numbers from `getPageGeometry`. *dev-browser:* N empty pages render.
- **PR-B5 — React: line-boundary spacers (the PM-decoration substitute).** Inject
  margins at fragment boundaries so a split block's later lines align to the next
  page's content-top. *dev-browser:* a block taller than a page visually splits
  cleanly across page boxes (no bleed, no clone).
- **PR-B6 — projected selection.** `useProjectedSelection`: map the Slate selection
  to per-page rects across gaps; render highlight + caret. *dev-browser:* select
  across a page boundary; caret lands correctly on both sides of the gap.
- **PR-B7 — plugin packaging.** Footnote-style Base + WeakMap registry + React lift;
  `viewMode` option; public API (`.` base/queries, `/react` plugin+overlay+hooks).
  *dev-browser:* register `PaginationPlugin` alone → it works.
- **PR-B8 — static/print path.** `serializeHtml` + `@page` + `break-inside`. Verify
  print/PDF output paginates.
- **PR-B9 — migrate template + cleanup.** Replace scratch demo with the plugin;
  redeploy; final dev-browser pass.

## Test strategy
Pure layers (compose/measure/mapping/projection/selection-rect math) are TDD
red-green with canvas-stubbed pretext (deterministic). Render + selection phases
(B4–B7) are verified in `dev-browser` (page geometry, mid-block split, cross-gap
selection are inherently visual). Fixture tiers smoke/core/stress with declared
expected page count + break events; determinism gate on the pure layout.

## Model review consensus (glm-5.1 + deepseek-v4-pro, both biased to B)

Both confirm **B is correct**; two-mode is rejected as the wrong trade. Verdicts:
- "Two-mode trades **all fidelity** for simplicity — what Google Docs did ~2010 and
  spent a decade replacing." (glm)
- "If you accept the two-mode compromise you may as well not build pagination —
  just use CSS `@page` and call it done." (deepseek)
- Two-mode's fatal flaws: not WYSIWYG (edit≠print line breaks), no widow/orphan
  control without real measurement, can't show a paragraph split across pages, and
  PRINT mode is read-only (can't fix a widow there).

**De-risking findings (both):**
- **No Slate fork needed.** premirror explicitly deferred "true multi-root edit
  surfaces" (`design-proposal.md:97`); the single-contenteditable + page-box-overlay
  model works with standard slate-react.
- **All Slate APIs keep working.** Doc model is unchanged, so `Editor.above/node/parent`
  operate on the source tree regardless of which page the caret is visually on — the
  projection is purely visual.
- **IME anchors naturally** in one continuous contenteditable (single text flow);
  lower risk than feared — but CJK IME testing is mandatory.
- **Infra already exists:** `BlockFragment.lineStart/lineCount` + `splittable` in
  `types.ts`, `measureTextLines` in `pretext.ts`, `mapping.ts`/`projection.ts`. The
  port is mostly *upgrade compose block→line + add selection projection + incremental*.

## Hardest risks (ranked by both models, with premirror's answer)

1. **🔴 Synthetic/projected selection across pages (CRITICAL).** Native selection
   can't draw across absolutely-positioned page boxes. premirror hides native
   `::selection` and **paints** rects via `collectRectsForPmRange` + `useProjectedSelection`
   (`react/index.tsx:265-344`). Slate version: intercept selection change, map
   path-based `editor.selection` → fragment coords via `MappingIndex.fragmentOfBlockLine`
   (`mapping.ts:56`), render a synthetic highlight overlay from `fragmentRects`
   (`projection.ts:31`). Native caret/typing stays native; only the highlight is painted. → PR-B6.
2. **🔴 Per-edit recompose perf / incremental invalidation (HIGH).** Every keystroke =
   snapshot→measure→compose→re-render, and a naive `MappingIndex` rebuild is **O(pages)**.
   premirror uses an invalidation plugin tracking the changed range
   (`prosemirror-adapter/src/index.ts:59-81`), prepared-run caching, and rAF batching
   (`design-proposal.md:423-435`). Slate version: inspect `editor.operations` to find
   dirty blocks, measure only those (cache already keyed by id+width), patch the mapping
   incrementally. → cross-cutting; lands as **PR-B10 (incremental)** after correctness.
3. **No Slate positioning decoration** → margin-spacer splitting (PR-B5). premirror
   aligns content into page boxes via line-boundary spacers (the same conclusion);
   we do it with computed margins since Slate has no widget decoration.
4. **Slate→snapshot offset-preserving adapter (labor, not concept).** premirror's
   snapshot carries `StyledRun{text,font,marks,pmRange}`; Slate has nested paths. For
   caret↔layout mapping we must flatten Slate text into runs **preserving text offsets**.
   glm: "single largest porting risk — labor-intensive." → folded into PR-B1/PR-B2.
5. **IME/caret near gaps** — test CJK (Google JP, macOS Pinyin) in dev-browser at PR-B6.

(Adds **PR-B10 — incremental invalidation** to the phase list: track dirty blocks via
`editor.operations`, measure-only-dirty, patch `MappingIndex`. Ships after B1–B9 correctness.)

## Status
Plan complete; both biased-B model reviews folded in (consensus: proceed with B).
No code yet — awaiting go on **PR-B1** (compose block→line fragmentation, TDD).
