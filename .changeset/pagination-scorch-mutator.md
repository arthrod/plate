---
"@platejs/pagination": major
---

Remove the document-mutating pagination engine. Pagination is now a derived projection: the document model is never wrapped in `page` nodes or reflowed between pages.

Removes `BasePaginationPlugin`, `PaginationPlugin`, `PaginationCoordinator`, `PageElement`, the `registry`/`leaderElection` exports, and the `@platejs/pagination/yjs` entry. The package now exports only the pure layout pipeline: `buildSnapshot`, `measureSnapshot`, `composeLayout`, `getPageGeometry`, `alignContentToLayout`, and the mapping/projection helpers.
