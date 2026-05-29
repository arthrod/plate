---
"@platejs/pagination": patch
---

Fix `measureSnapshot` cache thrashing when the same block is measured at multiple widths. The cache now keys each entry by `(block id, width)` instead of block id alone, so alternating widths (resize, side-by-side editors) stay cached instead of overwriting one slot.
