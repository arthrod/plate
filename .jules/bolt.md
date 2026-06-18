## 2024-05-24 - Do not eagerly evaluate generators using Array.from when short-circuit logic is possible
**Learning:** Using `Array.from` to convert a generator like `editor.api.levels` into an array to call `.some()` or `.every()` allocates memory for the entire array.
**Action:** Iterate the generator directly with a `for...of` loop to enable early O(1) short-circuit returns and avoid allocating the entire tree into memory.
