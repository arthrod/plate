## 2024-05-30 - Avoid Mapping and Reducing Slate Node Generators into Objects for Sets

**Learning:** Mapping, spreading, and reducing Slate's editor node generators (`editor.api.nodes`) into Arrays and Objects to check unordered collection equality adds unnecessary performance overhead vs using simple native JS Sets with manual iteration. Avoiding intermediate array allocations when converting node iterators improves performance significantly.

**Action:** Whenever converting Slate's node generators (`editor.api.nodes`) or arrays into uniqueness mappings, instantiate a new `Set` and populate it using a `for...of` loop over the iterator/array instead of combining `Array.from()` or spreads with `.map()` and `.reduce()`.
