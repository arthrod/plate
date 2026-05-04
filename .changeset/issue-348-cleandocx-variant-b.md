---
"@platejs/docx": minor
---

Make `cleanDocx` round-trip-safe for the DOCX tracking-token grammar (`[[DOCX_INS_*]]`, `[[DOCX_DEL_*]]`, `[[DOCX_CMT_*]]`). Each cleaner that touches text content or element-emptiness now consults a single `containsTrackingToken` predicate and short-circuits on positive matches; tokens stay as plain text the entire time, untouched, in their original positions. A `__TOKEN_AWARE_CLEANER__` marker plus a satisfies-clause registry inside `cleanDocx` makes adding a new cleaner without a token-handling decision a typecheck failure. No public API change. Variant B of three competing approaches (#347, #348, #349).
