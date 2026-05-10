## 2026-04-08 - [A11y Label Preference for Icons]
**Learning:** For automated translation reliability, using `<span className="sr-only">`/visually hidden text is preferred over `aria-label` attributes on icon-only buttons like `<Button size="icon">`.
**Action:** Always wrap accessible names in visually hidden spans inside icon-only buttons instead of adding an `aria-label` to the button itself.
