## 2024-10-25 - Avoid resolving generators into intermediate arrays
**Learning:** Eagerly resolving generators like `editor.api.nodes()` using `Array.from(...)` followed by multiple `.map()` and `.filter()` operations causes unnecessary O(N) memory allocations and extra loops, which can degrade performance in text-heavy suggestion components.
**Action:** Always iterate directly over the generator using a `for...of` loop in a single pass to aggregate required data, avoiding intermediate array creation and redundant traversals.
