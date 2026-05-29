---
"@platejs/pagination": patch
---

`getContinuousBreaks(layout)` names each interior page boundary by the block (and line) that begins the next page. The continuous overlay anchors its advisory rule to that boundary block's live DOM top, landing the line on a real block edge.
