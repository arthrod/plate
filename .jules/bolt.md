
## 2024-11-20 - Map Lookups over Array Find in High-Frequency React Hooks
**Learning:** In React components like toolbar buttons (e.g. TurnIntoToolbarButton), performing an O(N) `Array.find` over static arrays inside a `useMemo` hook runs whenever the underlying state (like editor selection values) changes. For static arrays with predictable values, converting them to a `Map` provides O(1) lookup.
**Action:** Replace `Array.find` calls with `Map.get` lookups by defining a module-level `Map` derived from the source static array, particularly effective in frequently updated UI components.
