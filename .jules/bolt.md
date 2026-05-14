## 2024-05-24 - Avoid Array.from().some() on Sets
**Learning:** Using `Array.from(set).some(...)` to check for a matching condition in a `Set` or generator eagerly allocates an intermediate array in memory, which reduces performance and memory efficiency.
**Action:** Iterate directly using a `for...of` loop over the `Set` or generator to enable early O(1) short-circuit returns and avoid unnecessary memory allocations.
