## 2026-03-05 - Add ARIA label to icon-only settings toggle button
**Learning:** Icon-only buttons used for toggles (like SettingsDialog) must explicitly declare their intent to screen readers using visually hidden text (e.g. `<span className="sr-only">Settings</span>`). Failing to do so makes the button's purpose completely opaque to accessibility tools.
**Action:** When adding or auditing icon-only buttons (especially `size="icon"` components like `<Button>`), unconditionally ensure an `aria-label` or `<span className="sr-only">\...\</span>` element is included.
