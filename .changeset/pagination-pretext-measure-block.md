---
"@platejs/pagination": minor
---

Block measurement is pretext-driven. `createDomMeasure` resolves each block's font and content width from the live editable, then derives height from the line count pretext wraps the text to (`measureBlockHeight`) — the line count, not the DOM box, owns layout height, so padding and margins do not perturb pagination.
