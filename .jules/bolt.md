## 2024-05-02 - Avoid Array.from() with editor.api generators
**Learning:** In `@platejs/slate` (and Slate in general), using `Array.from()` to eagerly evaluate generators like `editor.api.levels()` before checking conditions (like `some()`) forces unnecessary memory allocation and iterating the entire node path.
**Action:** Always iterate `editor.api.levels()` and `editor.api.nodes()` directly with `for...of` loops, allowing early O(1) returns and skipping array allocation altogether.
