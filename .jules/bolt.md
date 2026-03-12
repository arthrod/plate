
## 2024-03-01 - [O(N^2) Array Filter Bottleneck]
**Learning:** In highly trafficked area computations like SelectionArea logic dealing with sets of DOM nodes (`selected`, `stored`, etc.), nesting `Array.includes` inside `Array.filter` leads to severe `O(N * M)` scaling issues, stalling execution when many nodes are selected or traversed.
**Action:** Always convert "target" checking arrays to `Set` objects before doing intersection or difference filtering with `Array.filter` to reduce complexity to `O(N + M)` with `O(1)` Set lookups.

## 2025-02-19 - Replace O(N*M) Array filter with O(1) Set lookups
**Learning:** Performance-critical DOM filtering operations in `packages/selection/src/internal/SelectionArea.ts` used `Array.includes` inside `Array.filter` loops (e.g. `stored.filter(el => !elements.includes(el))`). This has an O(N*M) time complexity. For UI operations involving drag/selection where this is called repeatedly or with many elements, this can cause significant slowdowns.
**Action:** Always convert the target array to a `Set` before filtering to achieve O(1) lookups, reducing the complexity to O(N + M). This pattern should be standard for any array intersection/difference operations in high-frequency event handlers.
