---
"@platejs/pagination": patch
---

Build the layout `MappingIndex` once during `composeLayout` and expose it on `LayoutOutput.mapping`; projection reads it instead of rebuilding the index on every call.
