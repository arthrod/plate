## 2025-02-28 - Optimized Generator Iteration in `queryEditor`

**Learning:** When using generators (like `editor.api.levels()`), resolving the entire generator to an array using `Array.from()` before running `.some()` forces the JavaScript engine to allocate an array and iterate through the entire generator even if the target condition is met early on. Eager array allocation for hierarchical tree data results in unnecessary memory overhead and processing time, especially in large documents.

**Action:** Replace `Array.from(...).some(...)` with a `for...of` loop over the generator to allow for early exits (O(1) in the best case instead of O(N) where N is the generator length). This allows short-circuiting logic without the intermediate array allocation penalty.
