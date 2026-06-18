## 2024-05-20 - Generator O(1) Early Return Optimization
**Learning:** Eagerly resolving `editor.api.levels()` (and similar generators) with `Array.from()` to use array methods like `.some()` or `.filter()` forces the entire generator to allocate memory and prevents O(1) short-circuit returns.
**Action:** Always iterate generators directly using a `for...of` loop to benefit from early O(1) returns and avoid allocating the entire node tree into memory when performing node queries or filtering.
