## 2025-02-28 - Avoid eager array allocation for iterables
**Learning:** When evaluating iterables like `Set` or processing generators (like `editor.api.levels()`), using `Array.from(...).some(...)` or `.filter(...)` creates intermediate array allocations. This eager allocation adds O(N) memory overhead and eliminates the possibility of early short-circuit evaluation from `some()` running against the original Set.
**Action:** Always iterate directly with a `for...of` loop when possible to avoid allocating intermediate arrays into memory and taking advantage of O(1) early returns.
