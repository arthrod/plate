---
'@platejs/docx-io': patch
---

- Add a `./server` export alias so Node/server consumers can explicitly target server-safe DOCX APIs (for example `htmlToDocxBuffer`) while `/browser` remains Blob-oriented.
