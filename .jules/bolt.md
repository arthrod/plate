## 2024-10-24 - O(1) Map lookups for static React arrays
**Learning:** For static UI lookups in React renders or memoized computations (e.g. `Array.find` on constant configuration arrays like toolbar items), use a module-level `Map` and `Map.get` instead of `O(N)` `Array.find()`. This optimization is particularly beneficial when the lookup happens inside `useMemo` hooks or hot render paths.
**Action:** Always derive a `Map` from constant configuration arrays at module level and use `Map.get` for finding items during rendering.
