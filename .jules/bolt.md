
## 2025-02-19 - Replace O(N) array loops with O(1) Set lookups in SelectionArea
**Learning:** In `packages/selection/src/internal/SelectionArea.ts`, filtering performance bottlenecked on O(N*M) algorithmic complexity where `Array.prototype.includes` was used repeatedly inside O(N) loops during drag-and-select operations (`_updateElementSelection`, `_keepSelection`, `select`, `deselect`).
**Action:** Always precompute a `Set` for structural lookup arrays (`selected`, `stored`, `touched`, etc.) before using them inside `.filter` or manual loops involving `has` checks for O(1) time complexity when operating on many DOM elements.
