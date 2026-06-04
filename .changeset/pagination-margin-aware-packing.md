---
"@platejs/pagination": patch
---

Margin-aware page packing + continuous-overlay polish:

- Compose now packs pages by a block's **flow height** (text height + the DOM box spacing — margins/padding/borders — supplied by the measurer as `flowHeightPx`), falling back to text height when absent. The page count and break placement now match real DOM flow instead of under-counting per-page capacity. `heightPx`/`lineCount` stay text-only so line-level mapping is unaffected.
- Overlay labels show `Page N of M` and add a `Page 1 of M` marker, so the first page and total are always visible.
- Labels moved to the left margin gutter, so they stay on-screen when a narrow viewport overflows the page width.
- The recompute runs in a layout effect (before paint) instead of a post-paint `requestAnimationFrame`, so the advisory lines appear with the content as soon as the editor hydrates.
