## $(date +%Y-%m-%d) - Optimize SelectionArea array filtering with Set lookups
**Learning:** In highly interactive components like `SelectionArea.ts`, filtering large DOM element lists inside tight event loops (like `mousemove` during drag-selection) using `Array.prototype.includes` can cause severe `O(N*M)` performance bottlenecks.
**Action:** Always replace `Array.prototype.includes` checks inside `Array.prototype.filter` or loops with `Set.prototype.has` when operating on DOM element arrays during high-frequency events. This reduces the time complexity from `O(N*M)` to `O(N+M)`.
