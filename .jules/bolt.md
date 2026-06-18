## 2024-05-18 - Avoid Array.from on Generators
**Learning:** Eagerly resolving generators into arrays using `Array.from()` (e.g., `Array.from(editor.api.levels(...))`) is a performance anti-pattern. It allocates the entire sequence into memory and prevents early short-circuit returns during evaluation (like `.some()` or `.every()`).
**Action:** When querying or processing generators, iterate them directly with a `for...of` loop to enable early O(1) short-circuit returns and avoid unnecessary memory allocation.
