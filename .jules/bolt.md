## 2024-05-24 - O(1) Map Lookups for Toolbar Components
**Learning:** Replaced O(N) Array.find calls with O(1) Map lookups for static lookup tables in React components. This is especially effective in useMemo hooks or render loops.
**Action:** Define a module-level Map derived from the source array instead of using Array.find to improve performance.
