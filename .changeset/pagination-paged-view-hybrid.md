---
'@platejs/pagination': minor
---

Paged-view production parity (variant D — hybrid). Adds Word/Pages-style chrome configuration:

- `pageNumber: PageNumberConfig | null` option + `setPageNumber` transform. `<PageNumber />` renders as a non-editable React element (never a Slate void) inside the configured chrome band. Five formats: `decimal`, `roman`, `letter`, `1/N`, `page-of-n`. Honors `region`, `align`, `startAt`, `hideOnFirst`.
- `firstPageDifferent: boolean` + `firstPageHeader` / `firstPageFooter` content options + `setFirstPageDifferent` / `setFirstPageHeader` / `setFirstPageFooter` transforms. When enabled, page 0 paints alternative chrome content.
- `FootnotePlacement` widened to OOXML-aligned `pageBottom | beneathText | sectEnd | docEnd`. Legacy `'footer'` / `'documentEnd'` accepted as aliases. v1 implements `pageBottom` and `docEnd`; `beneathText` and `sectEnd` accepted by the type but the allocator falls back with a one-time console warning. `canonicalFootnotePlacement` exported for downstream switches.
- `chromeFocusDimsBody: boolean` option + `setChromeFocusDimsBody` transform + `ChromeFocusProvider` + `useChromeFocus` / `useShouldDimBody` hooks. When the editor selection lands inside a header / footer node, the live editable dims to 50% opacity with a 200ms transition. Honors `prefers-reduced-motion`.
- `<PageSetupDialog />` replaces `<MarginsDialog />` (kept as alias). Comprehensive controls: margins (per-axis, cm/in/mm/px), page size presets, header/footer height, page-number config, first-page toggle, footnote placement (4 modes), body-dim toggle.
