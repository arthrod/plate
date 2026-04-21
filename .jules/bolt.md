## 2024-05-24 - Optimize queryEditor by avoiding eager Array allocation
**Learning:** Eagerly resolving `editor.api.levels()` into an array using `Array.from()` to perform `.some()` or `.every()` checks causes unnecessary memory overhead and prevents early short-circuiting.
**Action:** When querying or processing generators, avoid eager resolution into arrays. Iterate the generator directly with a `for...of` loop to enable O(1) early returns and avoid large array allocations.
