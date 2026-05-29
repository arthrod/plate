# @platejs/pagination — Implementation Plan (Claude)

Standalone plan. Does **not** edit `2026-05-22-pagination-unified-plan.md`
(another agent is actively authoring that file). Grounded in the verified
current source (read 2026-05-23) + a triage of `premirror-audit-findings.md`
against the post-scorch tree (#408–#413).

`north-star reaffirmed: laws` — derived overlay; the Slate document never
mutates; pages are a render projection.

---

## 0. Audit triage — what the scorch already fixed vs what remains

The audit `premirror-audit-findings.md` predates the #408–#413 rewrite. Re-scored
against the current tree:

| # | Finding | Status now | Evidence |
|---|---------|-----------|----------|
| P0 | Run/text fidelity lost | **Partly fixed** — snapshot extracts block `text`; pretext measures real wrapped lines. Still block-granularity (no per-leaf runs/marks). | `snapshot.ts:84` (`text: nodeText`), `pretext.ts:34` |
| P1 | No `Point`↔`LayoutPoint` mapping | **OPEN** — mapping is block/line only. | `mapping.ts:18` |
| P2 | Clone-based split rendering | **STALE** — `splitClones.ts` deleted in scorch. | (file gone) |
| P3 | No dirty-range invalidation | **OPEN** — cache by `id@width`, but full pipeline each edit. | `measure.ts:55` |
| P4 | Line-breaking estimated not measured | **Largely fixed** — `measureBlockHeight` counts real pretext lines; `linesToPlace` deleted. `measure.ts` still has a `height/lineHeight` cache fallback. | `pretext.ts:57`, `compose.ts:63` |
| P5 | `MappingIndex` not in `LayoutOutput`, rebuilt per-call | **OPEN — cheapest win.** | `types.ts` (no `mapping`), `projection.ts:36,66` |
| P6 | No font model | **Partly fixed** — `domMeasure` resolves font + content width. | `domMeasure.ts:32,46` |
| P7 | No obstacle/slot (float, multi-column) | **OPEN (future).** | (none) |
| P8 | Spacer self-referential w/ offsetHeight | **Improved** — measure is pretext line-count, not `offsetHeight`, so the circularity is broken. Spacer still depends on prior layout. | `domMeasure.ts:69`, `alignContent.ts:18` |
| P9 | Determinism gap (clone DOM reads) | **STALE** — clones gone; compose is pure. | (file gone) |
| P10 | No previous-layout seam | **OPEN** — no incremental compose. | `measure.ts:45` |

**Conclusion:** the rendering hazards (P2/P9) are gone; the remaining debt is
**contract/correctness + scaling** (P5, P1, P3, P10) plus the missing plugin
host + render layers. This plan targets those in cost/value order.

---

## 1. Decision: compose granularity (place-whole vs line-split)

Two viable directions; this is the one real fork:

- **A. Keep place-whole (option C, current).** A block is atomic for layout; tall
  blocks overflow. Mid-block page appearance is a *cosmetic* spacer. Lowest risk,
  matches the user's earlier choice, ships fastest.
- **B. Real line-split in `composeLayout` + widow/orphan.** Uses the already-present
  `LayoutPolicies.widow/orphanLinesMin` (`types.ts:27`) and
  `BlockFragment.{lineStart,lineCount,fragmentIndex}` (`types.ts:107`) — infra
  that place-whole leaves unused. Higher fidelity (P4), but only *worth* it once
  selection projection (P1) exists, else a split block's caret/selection breaks.

**Plan choice:** ship **A first** (foundation + both render modes on place-whole),
then **B as a fast-follow gated on P1** (real splitting is pointless without
Point↔Layout mapping to project the caret across the split). This sequences risk
correctly and never ships a split the selection can't follow.

---

## 2. Stacked PRs (TDD red→green, branch-over-branch on #413)

### Foundation (shared by both render modes)

- **PR1 — embed `MappingIndex` in `LayoutOutput`, build once (P5).**
  `composeLayout` builds the mapping during composition and returns it on
  `LayoutOutput.mapping`; `fragmentRects`/`blockLinePosition` consume
  `layout.mapping` instead of rebuilding (`projection.ts:36,66`).
  *Red:* `out.mapping.pageOfBlock(2) === 1`; spy asserts `buildMappingIndex`
  **not** called inside `fragmentRects`. *Pure.*

- **PR2 — `Point`↔`LayoutPoint` mapping (P1).** During compose, accumulate
  `{path,offset}`→`{pageIndex,frameIndex,fragmentIndex,lineIndex,offsetInLine}`
  refs (premirror `LineRef` analog). Add `pointToLayout(point)` +
  `layoutToPoint(layoutPoint)` to the mapping. pretext line cursors
  (`MeasuredLine.start/end`, `pretext.ts:23`) seed the offset math.
  *Red:* caret at `{path:[3],offset:120}` resolves to the right page+line and
  round-trips back. *Pure, canvas-stubbed.*

- **PR3 — layout registry (footnote pattern).** `lib/registry.ts`:
  `WeakMap<SlateEditor,{output:LayoutOutput|null, dirty, measureCache}>`;
  `installLayoutRegistry` wraps `editor.apply`, marks dirty on content ops
  (`insert_text,remove_text,insert_node,remove_node,split_node,merge_node,move_node,set_node`),
  **not** `set_selection`; lazy rebuild on read. Precedent
  `footnote/registry.ts:11,95`, `slate-history/with-history.ts` op-inspection.
  *Red:* starts dirty; dirty after `insert_text`; clean after read; selection-only
  op stays clean. *Unit.*

- **PR4 — `BasePaginationPlugin` + `PaginationPlugin` host.**
  `createTSlatePlugin` base (options: `page/margins/policies/viewMode`) +
  `toPlatePlugin`; `useHooks` runs snapshot→measure→compose on change,
  rAF-batched (precedent `selection/useRequestReRender`), writes layout to the
  registry. Supplies the pretext/DOM `MeasureFn` (`createDomMeasure`). No visible
  render yet. *RTL:* edit → registry layout updates once per frame.

- **PR5 — print-parity gate (nail FIRST conceptually; lands here once the host
  exists).** Headless-Chrome: `serializeHtml` a fixture → render with CSS `@page`
  → extract real page-break Ys → assert within **±1 line** of pretext `breakYs`.
  Same `widthPx` (`@page` content rect) + same font
  (`getComputedStyle(editable).font`). Locks the premise for both modes.
  *dev-browser/headless.*

- **PR6 — static print path (P-authority).** `static/` render of `layout.pages`:
  `serializeHtml` + `@page` + `break-inside:avoid` on atomic blocks
  (`core/src/static/serializeHtml.tsx`, `pluginRenderElementStatic.tsx`).
  Authoritative PDF/print, shared by both modes.

### Render modes (on the foundation; selected by `viewMode`)

- **PR7 — `viewMode:'continuous'` (cheapest; prove the foundation).**
  `render.belowRootNodes` (`PlatePlugin.ts:476`): thin dashed semi-faded
  full-width rule + "Page N" tick at each break Y, `pointer-events:none`. No
  boxes, no spacers, pure flow → native selection/IME/find untouched.
  *dev-browser:* rules at correct Ys; editing fully native.

- **PR8 — `viewMode:'paged'` chrome + spacers (Approach B).**
  `render.afterEditable` → absolute A4 boxes + numbers behind the editable
  (`getPageGeometry`); `aboveNodes` margin spacers (lift `alignContentToLayout`)
  snap page-start blocks to the next page's content-top (`PlatePlugin.ts:447`).
  One DOM tree → native selection intact. *dev-browser:* blocks align into boxes,
  caret native.

- **PR9 — packaging + `viewMode` API.** `.` = base/registry/queries/pure pipeline;
  `/react` = plugin + overlays + hooks. Default `viewMode:'continuous'`.
  `pnpm brl`; changeset (patch). *dev-browser:* register plugin alone in each mode.

### Fidelity fast-follow (gated)

- **PR10 — line-split compose + widow/orphan (P4, decision B).** Reinstate
  line-granularity fragments in `composeLayout` using
  `LayoutPolicies.widow/orphanLinesMin`; orphan guard (avail < orphanMin → push
  whole), widow guard (pull lines back). **Gated on PR2** (selection must follow
  the split). *Pure, canvas-stubbed:* 50-line block splits 46/4; atomic stays whole.
- **PR11 — mid-block split spacer + cross-gap selection cosmetics.** Paged-mode
  in-block gap at the split line; supplemental highlight rects via
  `getRangeBoundingClientRect`/`getSelectionRects` (floating/cursor). *dev-browser.*
- **PR12 — dirty-range incremental (P3/P10).** Inspect `editor.operations` for
  changed block paths; measure-only-dirty; pass previous layout to compose to skip
  unchanged pages. *Bench: O(changed) not O(pages) at 100+ pages.*

---

## 3. Four-axis assessment (paged=B vs continuous=two-mode)

- **(a) Soundness/risk:** continuous = lowest (overlay rules, nothing reflows;
  only risk is break-vs-print drift, killed by PR5). paged = highest fidelity;
  risks are spacer/scroll exactness + (with PR10/11) mid-block caret. All risk is
  in the render layer; the pipeline + registry are mode-agnostic.
- **(b) Compute:** shared per-edit snapshot→measure(dirty)→compose ≈ O(blocks)
  until PR12 makes it O(changed). continuous adds a few absolute rules (~free);
  paged adds spacer reflow + chrome repaint. 100+ pages: profile spacer recalc
  (paged); continuous scales flat.
- **(c) Yjs:** both safe by construction — zero doc mutation; layout is per-client
  `WeakMap` derived state, nothing crosses the wire. Caveat: paged spacers/split
  gaps must be CSS/render-slot only, never `setNodes`.
- **(d) UX:** continuous = maximal native fidelity (selection/IME/a11y/find), page
  awareness via faded lines, not pixel-WYSIWYG. paged = Word-class WYSIWYG, mid-block
  splits visible (after PR10/11), at per-edit recompute cost. Mode switch is cheap
  (same registry; mount/unmount render layer). Ship continuous default, paged opt-in.

---

## 4. Sequencing summary

PR1 (P5) → PR2 (P1) → PR3 (registry) → PR4 (host) → PR5 (parity gate) →
PR6 (print) → PR7 (continuous) → PR8 (paged) → PR9 (packaging) →
[gated] PR10 (line-split) → PR11 (split spacer+selection) → PR12 (incremental).

Every PR: rigid TDD (pure layers canvas-stubbed; render/selection in dev-browser),
stacked branch-over-branch, `check` before PR.

---

## 6. Salvaged external references

From a DOCX→HTML paginator (Docxodus `PaginationEngine`). Its architecture is the
**rejected** one (DOM-clone page boxes, `getBoundingClientRect` measurement, DOM
mutation — our audit P2/P8/P9), so **no code is adopted**. Only these algorithms
/specs are kept, each tagged with the PR it informs:

1. **Margin-collapsing in the flow → near-term correctness fix (informs F2 / line-split).**
   Adjacent block margins collapse: the gap between two stacked blocks is
   `max(prevMarginBottom, currMarginTop)`, not their sum. Their flow uses
   `effectiveMarginTop = max(currTop, prevBottom) − prevBottom`. Our `composeLayout`
   stacks by raw `heightPx` and `alignContent` ignores collapse, so multi-block
   break-Y drifts by the collapsed margin. Adopt the formula when compose starts
   accumulating real inter-block spacing (break-Y emission). pretext gives line
   boxes, not block margins — block margins still come from computed style.

2. **Header/footer by page-position + effective content height → print path (PR6) + future H/F.**
   Per-section header/footer with `default | first | even` variants selected by
   `(pageInSection === 1 ? first : globalPageNumber % 2 === 0 ? even : default)`;
   a header/footer taller than its margin *expands* and reduces content height:
   `contentHeight −= (headerHeight − marginTop) + (footerHeight − marginBottom)`.
   Exactly what `@page` margins + a headers/footers feature need.

3. **Footnote-area reservation + split/continuation → footnotes-meet-pagination phase.**
   Reserve bottom-of-page footnote space (cap `MAX_FOOTNOTE_AREA_RATIO ≈ 0.6` of
   content height; keep `MIN_BODY_CONTENT_HEIGHT`); when a footnote overflows, split
   it at child-element boundaries and carry a continuation to the next page. Pairs
   with `@platejs/footnote`.

4. **Token/offset position model → PR2 (`Point↔LayoutPoint`, audit P1).** PAWLS
   `PawlsToken {x,y,width,height,text}` + `TextSpan {start,end}` validate the target
   shape: char-offset spans ↔ layout coordinates. Our analog feeds from pretext line
   cursors (`MeasuredLine.start/end`) rather than a token layout engine.

Page dimensions confirm our presets (US Letter 612×792pt, A4 595×842pt; default
margins 72pt, header/footer distance 36pt) — informational only.
