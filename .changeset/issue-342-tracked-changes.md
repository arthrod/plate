---
"@platejs/docx-io": minor
---

Add scaffolds for DOCX tracked-changes (`<w:ins>` / `<w:del>`) round-trip via embedded tracking tokens. Exports new `parseDocxTrackedChanges`, `applyTrackedChangeSuggestions`, `injectDocxTrackingTokens`, `createSearchRangeFn`, plus the locked `[[DOCX_INS_*]]` / `[[DOCX_DEL_*]]` token grammar constants. `ImportDocxOptions.tracking` and `DocxExportOperationOptions.tracking` enable the (forked) Mammoth + token-resolver branch; the deep traversal lands behind the public surface.
