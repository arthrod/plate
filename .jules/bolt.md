
## 2024-03-01 - [O(N^2) Array Filter Bottleneck]
**Learning:** In highly trafficked area computations like SelectionArea logic dealing with sets of DOM nodes (`selected`, `stored`, etc.), nesting `Array.includes` inside `Array.filter` leads to severe `O(N * M)` scaling issues, stalling execution when many nodes are selected or traversed.
**Action:** Always convert "target" checking arrays to `Set` objects before doing intersection or difference filtering with `Array.filter` to reduce complexity to `O(N + M)` with `O(1)` Set lookups.

## 2024-05-13 - [O(1) Set Intersections]
**Learning:** For performance-critical filtering of DOM elements (e.g., in `packages/selection`), use `Set` objects for O(1) lookups instead of `Array.includes` to prevent O(N*M) algorithmic complexity slowdowns during intensive operations like drag/selection. When refactoring O(N^2) array intersection checks, ensure the `Set` is instantiated from the target array, not the iterating array, to prevent tautological bugs.
**Action:** Replace `arrayA.filter(v => arrayB.includes(v))` with `const setB = new Set(arrayB); arrayA.filter(v => setB.has(v))` in performance-sensitive DOM filtering loops, ensuring correct set initialization.
