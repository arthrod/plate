## 2025-02-14 - Optimize queryEditor generator evaluation
**Learning:** Eagerly resolving `editor.api.levels()` (or any node generator) into an array with `Array.from()` to use array methods like `.some()` forces the entire hierarchy into memory and prevents early O(1) exits.
**Action:** Always iterate generators directly using a `for...of` loop when filtering or checking for existence, allowing for immediate short-circuit returns and avoiding array allocations.
