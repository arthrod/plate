---
"@platejs/pagination": patch
---

Continuous-view React host: `PaginationPlugin` runs the pretext pipeline (snapshot → measure → compose) against the live editable on content edits and width changes, then paints advisory page-break rules as an `afterEditable` overlay. Each rule anchors to the live DOM top of the block pretext chose to begin the next page (`breaks` option), so it lands on a real block edge; the `Page N` label sits in the right margin gutter. `pointer-events: none` keeps editing and selection fully native; the document is never mutated.
