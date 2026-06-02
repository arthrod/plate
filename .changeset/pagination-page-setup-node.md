---
"@platejs/pagination": minor
---

Add document-level page setup persisted in the Slate value: `BasePageSetupPlugin` (a void `page_setup` node normalized to a single leading node) plus `getPageSetup`/`setPageSetup`, `DEFAULT_PAGE_SETUP`, and the `PageSetupConfig` type (page size, margins, working unit, page-number placement, footnote mode, header/footer chrome).

Add a `skipTypes` option to `buildSnapshot` so non-content nodes (e.g. `page_setup`) are excluded from pagination while surviving blocks keep their real Slate paths.
