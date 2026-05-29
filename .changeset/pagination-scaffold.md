---
'@platejs/pagination': minor
---

`@platejs/pagination` is a render-time overlay pagination package (variant A). Pages are derived from `editor.children` and painted as an `afterEditable` overlay; the document is never mutated. The package includes header, footer, and page-break element plugins; a footnote sub-plugin bundle; a DOM-backed measurer with a bounded LRU cache keyed by `(node.id, marks-fingerprint, font, width)`; editor API (`getPages`, `getPageOf`, `getFootnotes`); and transforms (`insertPageBreak`, `setHeader`, `setFooter`).
