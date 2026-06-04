---
"@platejs/docx-io": minor
---

Add scaffolding for DOCX tracked-changes (`<w:ins>` / `<w:del>`) round-trip via embedded tracking tokens. Exposes `parseDocxTrackedChanges`, `applyTrackedChangeSuggestions`, `injectDocxTrackingTokens`, `createSearchRangeFn`, the locked `[[DOCX_INS_*]]` / `[[DOCX_DEL_*]]` token grammar constants, and `ImportDocxOptions.tracking` / `DocxExportOperationOptions.tracking` API surface. Deep traversal is not implemented yet — calling these entry points throws until the resolver lands.
