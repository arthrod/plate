---
"@platejs/docx": minor
---

Make `cleanDocx` round-trip-safe for the DOCX tracking-token grammar (`[[DOCX_INS_*]]`, `[[DOCX_DEL_*]]`, `[[DOCX_CMT_*]]`). Tokens are swapped with opaque `<span data-docx-tracking-token>` placeholders before the cleanup pipeline runs and restored byte-for-byte after — so token JSON payloads, end-only paragraphs, and adjacent tokens survive every cleaner. No public API change. Variant A of three competing approaches (#347, #348, #349); ships shared token-grammar constants under `@platejs/docx`.
