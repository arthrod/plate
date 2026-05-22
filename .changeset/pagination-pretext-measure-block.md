---
"@platejs/pagination": minor
---

Make block measurement pretext-driven. `createDomMeasure` now resolves each block's font and content width from the live editable, then derives height from the line count pretext wraps the text to (new `measureBlockHeight`) — the line count, not the DOM box, owns layout height, so padding/margins no longer perturb pagination.
