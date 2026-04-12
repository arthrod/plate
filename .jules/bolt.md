## 2025-02-28 - Optimized Slate Node Merge Level Resolution
**Learning:** `editor.api.levels()` execution in `mergeNodes.ts` historically mapped array creations `Array.from(_levels, ([n]) => n).slice(...).slice(...)` and re-allocated a `Set`. By replacing this with a single iteration loop matching common path index skips, unnecessary array traversals are mitigated and memory thrashing reduced for long documents.
**Action:** Iterate iterators directly rather than casting via `Array.from` combined with multiple `slice()` calls whenever a partial window into an iterator is needed.

## 2025-02-28 - Set Initializations inside React Components
**Learning:** `new Set(Array.from(array).map(...))` is redundant and adds unnecessary arrays to the GC. `insertedNodes.map` followed by `new Set` constructor iterates twice. Replaced with single loop to add elements iteratively.
**Action:** Favor iterating arrays or iterators sequentially into Set primitives vs mapping then casting.
