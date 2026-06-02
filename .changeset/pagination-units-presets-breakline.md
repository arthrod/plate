---
"@platejs/pagination": minor
---

Add `lengthToPx`/`pxToLength` length conversion (in/cm/px @96dpi) and `getPresetPageSpec('letter' | 'a4')` for page geometry.

Add a `breakLineStyle` option (`'dashed' | 'dotted' | 'solid'`, default `'dashed'`) controlling the continuous-view page-break rule.

Mark header/footer chrome bands `aria-hidden` so assistive tech announces only the document body.
