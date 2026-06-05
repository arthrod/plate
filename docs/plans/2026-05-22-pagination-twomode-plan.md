# Pagination — Plan Two-Mode (continuous edit + authoritative print)

Implements **two-mode**: EDIT = one continuous editable in normal flow with thin
semi-faded break-lines at pretext-computed page-break Ys (native selection/IME/a11y/find);
PRINT = authoritative `serializeHtml` + CSS `@page`. Shares **Phase 0** verbatim
with Plan B (`2026-05-22-pagination-B-plan.md`).

## Cross-cutting invariants (identical to Plan B)
- Document never mutates (yjs-safe). One continuous editable. pretext is the break
  measurement core. Print authority = `serializeHtml` + `@page` + `break-inside`.

## Phase 0 — SHARED FOUNDATION (same PRs as Plan B: F1–F5)
- **F1** layout registry (footnote `WeakMap`+dirty-on-apply, lazy rebuild).
- **F2** break-Y emission from pretext (incl. mid-block crossing line).
- **F3** pipeline-as-authority host (rAF-batched recompute → registry).
- **F4** print-parity gate: headless-Chrome test asserting pretext `breakYs` match
  real `@page` page breaks within **±1 line**. (For two-mode this is THE credibility
  gate — both two-mode reviews named it the one thing to nail first.)
- **F5** static print path (`serializeHtml` + `@page` + `break-inside`).

## Phase T* — TWO-MODE-SPECIFIC RENDER (on top of Phase 0)
- **T1 — faded break-line overlay.** `render.belowRootNodes` (`PlatePlugin.ts:476`):
  for the block whose accumulated Y crosses a page boundary, render a thin dashed
  semi-faded full-width rule at the crossing Y + a "Page N" tooltip/tick.
  `pointer-events:none`. No page boxes, no spacers, no gaps — pure continuous flow.
  *dev-browser: faded lines fall at correct Ys; editing/selection fully native.*
- **T2 — `viewMode:'continuous'`** wiring + page-number gutter (optional). Toggling to
  `'paged'` is Plan B's render (the two share the foundation, differ only here).
- **T3 — print-preview pane (optional).** Render the F5 `serializeHtml`+`@page` output
  in an iframe/preview so headers/footers/exact breaks are viewable on demand.

## Deliberately given up (both two-mode reviews concede)
- Mid-paragraph split *visualization* while editing (break-line shows block-level
  crossing; the print path splits exactly).
- Pixel-exact WYSIWYG while editing (print is the source of truth).
- Multi-column edit view (print-layout concern).

## Risk → mitigation
- **Break-line vs print drift (the critical one):** both modes consume the SAME
  pretext measurement at the SAME `widthPx` (from `@page` content rect) and SAME font
  (`getComputedStyle(editable).font`). The F4 ±1-line test enforces it.
- mode-switch UX → label break-lines "advisory"; print authoritative.
- headers/footers/multi-column → live only in the print path (F5) / preview (T3).

## Compute / yjs / UX (summary)
- **Compute:** near-zero in edit mode — pretext line-count accumulation + a few
  absolutely-positioned faded rules; no spacers, no projected selection, no per-edit
  page reflow. Print path runs only on print/preview.
- **yjs:** safe — zero document mutation; break-Ys are per-client derived.
- **UX:** maximal native fidelity (selection/IME/find/a11y/spellcheck) + page-awareness
  via break-lines. Cost: edit≠print page boxes (honest "edit view vs print").
