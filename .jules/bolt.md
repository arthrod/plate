
## 2024-03-01 - [O(N^2) Array Filter Bottleneck]
**Learning:** In highly trafficked area computations like SelectionArea logic dealing with sets of DOM nodes (`selected`, `stored`, etc.), nesting `Array.includes` inside `Array.filter` leads to severe `O(N * M)` scaling issues, stalling execution when many nodes are selected or traversed.
**Action:** Always convert "target" checking arrays to `Set` objects before doing intersection or difference filtering with `Array.filter` to reduce complexity to `O(N + M)` with `O(1)` Set lookups.
