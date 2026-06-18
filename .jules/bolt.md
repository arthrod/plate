## 2024-05-18 - Avoid array conversion for generator evaluation
**Learning:** In the project's Bun/V8 environment, aggressively converting generators to arrays (e.g. `Array.from(editor.api.levels(...))`) and using array higher order functions (`some`, `every`) incurs a lot of allocation overhead, which is bad for frequently executed functions like `queryEditor`.
**Action:** Iterate over generators directly with `for...of` loops. This enables O(1) early returns and avoids large allocations.
