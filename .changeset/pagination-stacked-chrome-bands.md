---
"@platejs/pagination": minor
---

Restructure chrome into stacked, content-sized bands matching the page order `number · header · body · footnote · footer · number`:

- Page number is its own one-line band. New `PageNumberConfig` (`format`: `arabic` / `roman-upper` / `roman-lower` / `custom` with `{n}`/`{total}`, ≤500 chars; `location`: `top` / `bottom`; `align`; `differentFirstPage`). `normalizePageNumber` auto-fills the reciprocal of format/location. Adds `formatPageNumber` and `toRoman`.
- Header/footer are full-width single lines (no corner slot).
- Bands are sized to their stacked line count × the resolved line height (the now-exported `resolveLineHeight`), so each band hugs its content instead of reserving a fixed slab.
- A per-page footnote separator band sits above the footer when footnotes are per-page.
- Layout recomputes on footnote-mode change.
