---
"@platejs/docx-io": minor
---

Add an opt-in tracking import branch (`ImportDocxOptions.tracking: true`) that extracts `[[DOCX_(INS|DEL|CMT)_*]]` tokens from the raw HTML before `cleanDocx` runs and re-anchors them on the deserialized tree via `reapplyTokens`. `@platejs/docx`'s `cleanDocx` stays untouched and token-blind. Anchor-resolution failures are aggregated into `result.errors`. Variant C of three competing approaches (#347, #348, #349).
