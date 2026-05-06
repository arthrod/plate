---
'@platejs/pagination': minor
---

Add `@platejs/pagination` package — render-time overlay pagination (variant A). Pages are derived from `editor.children` and painted as an `afterEditable` overlay; the document is never mutated. Includes header / footer / page-break element plugins, footnote sub-plugin bundling, a DOM-backed measurer with bounded LRU cache keyed by `(node.id, marks-fingerprint, font, width)`, and editor API (`getPages`, `getPageOf`, `getFootnotes`) plus transforms (`insertPageBreak`, `setHeader`, `setFooter`).
