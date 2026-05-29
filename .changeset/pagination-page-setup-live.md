---
"@platejs/pagination": minor
---

Add `PageSetupPlugin` (React): renders the `page_setup` node invisibly at block index 0 so document-level page geometry (page size + margins) drives pagination while the node itself is excluded from layout.

Add `pageSetupToLayoutInput`, `resolveChromeBands`, and `pageNumberBand` to bridge a `PageSetupConfig` into the engine's `LayoutInput`.
