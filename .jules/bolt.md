## 2025-03-08 - Generator Iteration
**Learning:** Eagerly resolving generators like editor.api.levels() with Array.from() causes unnecessary intermediate allocations in functions like queryEditor.
**Action:** Iterate the generator directly with a for...of loop to enable early short-circuit returns and avoid allocating the entire tree into memory.
