
## 2024-03-01 - [O(N^2) Array Filter Bottleneck]
**Learning:** In highly trafficked area computations like SelectionArea logic dealing with sets of DOM nodes (`selected`, `stored`, etc.), nesting `Array.includes` inside `Array.filter` leads to severe `O(N * M)` scaling issues, stalling execution when many nodes are selected or traversed.
**Action:** Always convert "target" checking arrays to `Set` objects before doing intersection or difference filtering with `Array.filter` to reduce complexity to `O(N + M)` with `O(1)` Set lookups.

## 2024-03-09 - Set vs Array.includes for Set Intersections
**Learning:** When refactoring O(N^2) checks like `arrayA.every(v => arrayB.includes(v))` into O(N) by using a Set, it's critical to instantiate the Set from the TARGET array (`arrayB`), not the iterating array (`arrayA`). Instantiating `new Set(arrayA)` and checking `arrayA.every(v => setA.has(v))` creates a tautology that always evaluates to true, breaking application logic.
**Action:** When converting `.includes` to `.has` inside `.every()` or `.filter()`, always double-check which variable is being used to populate the `Set`.

## 2024-03-09 - Avoid micro-optimizations that allocate objects on high-frequency events
**Learning:** Creating new `Set` instances inside high-frequency event handlers like pointer down/move (e.g., from small arrays like `evt.composedPath()`) creates unnecessary garbage collection overhead that outweighs the theoretical O(1) vs O(N) lookup benefit for arrays with < 20 elements. This is an anti-pattern for a performance agent.
**Action:** Only refactor `Array.includes` to `Set.has` when the target array has the potential to grow large (e.g. hundreds of selected DOM elements). Avoid instantiating new Collections on the critical path of input events for very small arrays.
