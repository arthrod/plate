---
"@platejs/pagination": minor
---

Restructure chrome into stacked, content-sized bands matching the page order `number · header · body · footnote · footer · number`:

- Page number is its own one-line band. New `PageNumberConfig` (`format`: `arabic` / `roman-upper` / `roman-lower` / `custom` with `{n}`/`{total}`, ≤500 chars; `location`: `top` / `bottom`; `align`; `differentFirstPage`). `normalizePageNumber` auto-fills the reciprocal of format/location. Adds `formatPageNumber` and `toRoman`.
- Header/footer are full-width single lines (no corner slot).
- Bands are sized to their stacked line count × the resolved line height (the now-exported `resolveLineHeight`), so each band hugs its content instead of reserving a fixed slab.
- A per-page footnote separator band sits above the footer when footnotes are per-page, labelled `footnote` so the area is visible even with no footnote content.
- The page-break line is a faint slate-300 hairline spanning the full page width (edge to edge, into the left/right margins) while chrome bands stay within the content box — pure overlay geometry, no DOM or document mutation.
- One shared chrome design language: `CHROME_INK` (slate-600), `CHROME_RULE` (slate-200) and `CHROME_FONT` are exported from `@platejs/pagination/react` and reused by every band. Configured header/footer/page-number rows seed these defaults (restrained 11px running text) so an unstyled band never falls back to 16px black; authored styles still override.
- Page numbers use `tabular-nums` everywhere so digits never reflow between pages. The footnote separator is an academic 1/3-width hairline above a small-caps caption.
- Layout recomputes on footnote-mode change.
