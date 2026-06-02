---
"@platejs/pagination": minor
---

Repaginate on content changes: a debounced content observer recomputes the layout as the document grows or shrinks. Previously the page count froze at its mount-time value until a width or geometry change, so adding content past the initial pages did not add pages. The recompute stays debounced, so the pretext pipeline still never runs per keystroke.

Add `pageNumberStyle` and `footnoteStyle` to `PageSetupConfig` for page-number and footnote typography; the chrome page number renders with `pageNumberStyle` when set.
