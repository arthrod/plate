---
"@platejs/docx-io": patch
---

Pass `Uint8Array` directly to the `Blob` constructor in `htmlToDocxBlob`, removing a redundant copy of the entire DOCX payload on every export.
