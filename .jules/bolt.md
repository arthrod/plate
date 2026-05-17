## 2024-05-17 - Avoid `Array.from()` when querying generators for performance
**Learning:** Resolving generators into arrays with `Array.from()` just to run methods like `.some()`, `.every()`, or `.filter()` causes unnecessary memory allocation and prevents O(1) early short-circuiting.
**Action:** Iterate directly over generators using `for...of` loops to enable early returns and avoid allocating intermediate arrays.
