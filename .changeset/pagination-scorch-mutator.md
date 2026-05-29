---
"@platejs/pagination": major
---

Pagination is a derived projection of the document: the document model is never wrapped in `page` nodes or reflowed between pages. The package exports only the pure layout pipeline — `buildSnapshot`, `measureSnapshot`, `composeLayout`, `getPageGeometry`, `alignContentToLayout`, and the mapping/projection helpers. The document-mutating engine (`BasePaginationPlugin`, `PaginationPlugin`, `PaginationCoordinator`, `PageElement`, the `registry`/`leaderElection` exports, and the `@platejs/pagination/yjs` entry) is no longer part of the package surface.
