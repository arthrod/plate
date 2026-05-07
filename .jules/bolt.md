## 2024-05-24 - Avoid intermediate array allocations for `Set` checks
**Learning:** When collecting items into a `Set` from generators or mapped arrays, avoid intermediate array allocations like `Array.from(set).some(...)` or `Array.from(set).filter(...)`. Instantiating an array to perform simple iteration is unnecessary overhead.
**Action:** Use a `for...of` loop directly on the `Set` instance to avoid memory overhead and enable early O(1) short-circuit returns.
