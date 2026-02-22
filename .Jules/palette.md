## 2026-02-22 - Static Screen Reader Text in Copy Buttons
**Learning:** Copy buttons often use static `sr-only` text ("Copy") even after the action is successful, providing no feedback to screen reader users. The same applies to tooltips.
**Action:** Always update `sr-only` text and tooltip content to "Copied!" (or similar) upon successful action, and use a timeout to revert it.
