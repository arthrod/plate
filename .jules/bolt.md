## 2024-03-28 - Optimize static array lookups in high-frequency React hooks
**Learning:** O(N) Array.find calls on static lookup tables inside React hooks like useMemo or render loops can cause unnecessary performance overhead in UI components like toolbars.
**Action:** Always replace O(N) Array.find calls on static UI configuration arrays (e.g., turnIntoItems) with an O(1) module-level Map.get lookup when the lookup depends on dynamic state variables (e.g., selection value).
