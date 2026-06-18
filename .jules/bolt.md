## 2024-05-24 - Avoid eager Array.from() resolution for generators like editor.api.levels
**Learning:** When querying or processing generators (like `editor.api.levels()`), resolving them eagerly into arrays using `Array.from()` to run array methods like `.some()`, `.every()`, or `.filter()` forces the entire tree traversal path into memory at once, and prevents early returns.
**Action:** Iterate the generator directly with a `for...of` loop to enable early O(1) short-circuit returns and avoid allocating the entire tree into memory.
