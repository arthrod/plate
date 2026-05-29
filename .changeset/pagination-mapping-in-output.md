---
"@platejs/pagination": patch
---

`composeLayout` builds the `MappingIndex` once and exposes it on `LayoutOutput.mapping`; projection reads the prebuilt index directly.
