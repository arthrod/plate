---
"@platejs/pagination": patch
---

Margin-aware page packing and continuous-overlay behavior:

- Compose packs pages by a block's **flow height** (text height + DOM box spacing — margins, padding, borders — supplied by the measurer as `flowHeightPx`), falling back to text height when absent. Page count and break placement match real DOM flow; `heightPx` and `lineCount` stay text-only so line-level mapping stays unaffected.
- Overlay labels show `Page N of M` and include a `Page 1 of M` marker, keeping the first page and total visible.
- Labels sit in the left margin gutter, staying on-screen when a narrow viewport overflows the page width.
- The recompute runs in a layout effect (before paint), so advisory lines appear with the content as soon as the editor hydrates.
