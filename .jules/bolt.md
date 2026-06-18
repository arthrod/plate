## 2024-06-03 - Iterate Generators Directly Instead of Array.from()
**Learning:** Eagerly resolving Plate/Slate tree query generators (like `editor.api.levels()`) into arrays using `Array.from()` to run `.some()` or `.filter()` allocates the entire tree path into memory unnecessarily.
**Action:** Iterate the generator directly with a `for...of` loop to enable early O(1) short-circuit returns and eliminate array allocation overhead.
