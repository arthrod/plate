# Pagination — Plan B (page-box line projection), findings-infused

Implements **B**: WYSIWYG paginated editing — page boxes visible while editing,
blocks visually split across pages. Structured so **Phase 0 (Shared Foundation)
is identical to the two-mode plan's base** — only the render layer (Phase B*)
differs. Builds on the green stack #408–#413.

## Cross-cutting invariants (all six model reviews + premirror agree)
- **Document never mutates** — derived overlay. (yjs-safe by construction: no
  page nodes, no reflow ops cross the wire.)
- **ONE continuous editable, never fragmented / multi-root.** premirror
  explicitly defers "true multi-root page edit surfaces" (`design-proposal.md:97-101`).
  Native selection / IME / a11y / find stay native because the DOM is one tree;
  page geometry is *visual* (chrome behind + spacer gaps), not separate DOM boxes.
- **pretext is the measurement core** (`measure/pretext.ts`) for break positions.
- **Print authority = `serializeHtml` + CSS `@page` + `break-inside`.**

## Phase 0 — SHARED FOUNDATION (== two-mode base)
These PRs are the base both plans need; the two-mode plan starts from here.

- **F1 — layout registry (footnote pattern).** `lib/registry.ts`:
  `WeakMap<SlateEditor,{layout,dirty}>`; `editor.apply` override marks dirty on
  content-mutating ops (precedent: `footnote/registry.ts`, `slate-history/with-history.ts`
  op-inspection); layout rebuilt lazily on read. Base stays pure (measurement injected). *TDD.*
- **F2 — break-Y emission.** compose walks blocks accumulating Y from pretext
  `measureBlockHeight`; emits page boundaries (`breakYs`) incl. the mid-block line
  where `currentY` crosses `contentHeight`. *Pure, TDD (canvas-stubbed pretext).*
- **F3 — pipeline-as-authority host.** `PaginationPlugin = toPlatePlugin(Base)`,
  `useHooks` runs snapshot→measure→compose on change (rAF-batched; precedent
  `selection/useRequestReRender`), writes layout to the registry. No render yet.
- **F4 — print-parity gate (THE thing to nail first; named by both two-mode reviews).**
  Headless-Chrome test: `serializeHtml` a fixture → render with `@page` → extract real
  page-break Ys → assert within **±1 line** of pretext `breakYs`. Locks the premise
  for *both* plans. *dev-browser/headless.*
- **F5 — static print path.** `static/` render: `serializeHtml` + `@page` + `break-inside`
  on atomic blocks. Authoritative PDF/print. Shared by both plans.

## Phase B* — B-SPECIFIC RENDER (on top of Phase 0)
- **B1 — page-box chrome overlay.** `render.afterEditable` → absolute white A4 boxes
  + numbers from `getPageGeometry`, rendered *behind* the editable. *dev-browser.*
- **B2 — gap spacers via `aboveNodes`.** Wrap each page-start block with a margin
  spacer pushing it to the next page's content-top (doc-non-mutating; precedent
  toggle/list `aboveNodes`, `PlatePlugin.ts:447`). One DOM tree → native selection
  intact. *dev-browser: blocks align into page boxes, caret/selection native.*
- **B3 — mid-block split spacer (the one genuinely novel bit).** For a block crossing
  a page boundary, inject an in-block gap at the break line via `decorate`+custom-leaf
  (or `belowRootNodes` sub-slot) so its later lines align to the next page top.
  *dev-browser: a tall paragraph splits across two boxes; caret correct on both sides.*
- **B4 — cross-gap selection cosmetics (optional).** Native selection already works
  (one tree); only the highlight crossing a gap looks odd. Paint supplemental rects
  via `getRangeBoundingClientRect`/`getSelectionRects` (`packages/floating`/`cursor`)
  + block-selection's `afterEditable` overlay pattern. NOT a native-selection replacement.
- **B5 — packaging + `viewMode:'paged'`.** Public API: `.` base/registry/queries,
  `/react` plugin+overlay+hooks. *dev-browser: register plugin alone → paged editing works.*

## Explicitly deferred (premirror defers it too)
Fragmented page-box DOM containers + full projected-selection replacement + the
~400-line bidirectional MappingIndex. Not needed while the editable stays one tree.

## Risk → in-repo prior art (every hard piece has a template)
- positioning into pages → `aboveNodes` (toggle/list)
- selection rects → `packages/floating` `getRangeBoundingClientRect`, `packages/cursor` `getSelectionRects`, `packages/selection` overlay
- incremental invalidation → `footnote/registry.ts` + `slate-history` op-inspection + `selection/useRequestReRender`
- residual novel: **mid-block split spacer (B3)** only.

## Compute / yjs / UX (summary)
- **Compute:** per-edit snapshot→pretext-measure(dirty only)→compose→rAF render. pretext is canvas/WASM-fast; dirty-block measure keeps it ~O(changed). Spacer reflow on layout change.
- **yjs:** safe — zero document mutation; layout is per-client derived state (WeakMap), never replicated.
- **UX:** WYSIWYG page boxes while editing; native selection/IME/find; mid-block splits visible. Cost: per-edit recompute; spacer/scroll alignment must be exact.
