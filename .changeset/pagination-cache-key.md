---
"@platejs/pagination": patch
---

`measureSnapshot`'s cache keys each entry by `(block id, width)`, so the same block measured at multiple widths (resize, side-by-side editors) keeps both entries cached without overwriting one slot.
