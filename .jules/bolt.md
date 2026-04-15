## 2025-03-05 - Avoid eager generator resolution for editor API queries
**Learning:** `editor.api.levels()` and other Slate API iterators return generators. Eagerly resolving them into arrays with `Array.from()` to use methods like `.some()` or `.filter()` needlessly allocates memory for the entire tree and prevents O(1) early returns.
**Action:** Always iterate generator results directly using `for...of` loops. This enables short-circuit returns and avoids array allocations entirely.
