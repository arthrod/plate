## 2024-05-09 - Avoid Array.from().some() on Sets
**Learning:** Using `Array.from(set).some()` eagerly resolves a Set into an array, allocating intermediate arrays in memory and losing the O(1) early short-circuit benefit of generators/iterables when a match is found early.
**Action:** Iterate directly with a `for...of` loop on Sets and iterables to enable early returns without allocating intermediate arrays.
