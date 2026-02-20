## 2024-05-22 - Recursive Object Allocation Overhead
**Learning:** The `applyDeepToNodes` utility was allocating a new options object for every recursive call, causing significant overhead in deep tree traversals (e.g., pasting large content). Flattening the arguments into a helper function reduced execution time by >50%.
**Action:** When implementing recursive traversal functions, prefer passing arguments directly or using a mutable context object instead of creating new objects at each step.
