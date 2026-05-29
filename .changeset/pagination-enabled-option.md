---
"@platejs/pagination": minor
---

The `enabled` option (default `true`) controls whether pagination is active at runtime. When `false`, the React layer skips layout recompute and renders no page-break overlay; the document is never affected. Toggle with `editor.setOption(BasePaginationPlugin, 'enabled', next)`.
