---
"@platejs/pagination": minor
---

Add an `enabled` option (default `true`) to toggle pagination at runtime. When `false`, the React layer skips layout recompute and renders no page-break overlay; the document is never affected either way. Toggle with `editor.setOption(BasePaginationPlugin, 'enabled', next)`.
