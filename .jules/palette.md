## 2025-05-18 - Improve accessibility of icon-only buttons
**Learning:** Using `<span className="sr-only">` instead of `aria-label` for icon-only buttons is preferred, because visually hidden text is more reliably translated by automated translation tools, making components more accessible across different languages.
**Action:** When adding accessible labels to icon-only buttons or interactive elements containing icons, append a screen reader-only `span` with the `sr-only` class rather than using the `aria-label` attribute directly.
