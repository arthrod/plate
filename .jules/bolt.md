## 2024-05-18 - Replace Array.find with Map.get for UI lookups
**Learning:** O(N) `Array.find` inside React components' render bodies or `useMemo` hooks can cause unnecessary overhead, especially for static arrays like UI toolbar items. Every re-render or dependency update triggers the linear scan again.
**Action:** Extract a module-level `Map` from static arrays (e.g., `const myMap = new Map(myArray.map(item => [item.key, item]))`) and use `myMap.get(key)` inside the component to achieve O(1) lookups, boosting performance in high-frequency rendering contexts without sacrificing readability.
