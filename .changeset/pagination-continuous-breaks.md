---
"@platejs/pagination": patch
---

Add `getContinuousBreaks(layout)`: each interior page boundary named by the block (and line) that begins the next page. The continuous overlay anchors its advisory rule to that boundary block's live DOM top, so the line lands on a real block edge instead of a text-only pixel sum that ignores DOM margins.
