## 2025-02-12 - O(N) to O(1) Static Array Lookup Replacement
**Learning:** Found O(N) `Array.find` lookups inside a frequently executed `useMemo` for determining active states in toolbar components (`turnIntoItems.find`). Even small arrays can incur a performance tax when recalculated constantly during active editing, especially for static arrays where the array length and values are deterministic.
**Action:** Replace `Array.find` iterations with O(1) `Map.get` module-level dictionary lookups for all statically defined array data structures mapped inside render blocks or `useMemo` hooks.
