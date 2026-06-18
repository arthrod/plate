## 2025-05-06 - Avoid eager array allocation from generators in utility queries
**Learning:** When querying generators like `editor.api.levels` or `editor.api.nodes`, calling `Array.from()` eagerly evaluates the whole tree into memory just to run array array methods like `.some()` or `.filter()`. This leads to unnecessary memory allocation and iterating the array multiple times.
**Action:** Iterate over generators directly with a `for...of` loop instead. This enables O(1) early short-circuit returns and avoids allocating large intermediate arrays in memory.
