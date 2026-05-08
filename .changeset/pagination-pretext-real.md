---
'@platejs/pagination': minor
---

Wire real `@chenglou/pretext` measurement: `prepare` / `prepareWithSegments` / `layout` for pure-text blocks, `prepareRichInline` / `measureRichInlineStats` for mixed-mark runs. Per-block computed font is read from the rendered DOM and `system-ui` is snapped to Inter (pretext caveat). Pagination cycles are rAF-coalesced inside `usePageLayout`. Add `mode: 'standard' | 'paged'` plugin option, `setMode` transform, hybrid-footer standard frame, `<PaginationToolbar />` (single dropdown for mode + paper preset), and `<MarginsDialog />` for custom four-sided margin entry.
