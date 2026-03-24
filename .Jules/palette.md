# Palette Journal

## 2024-05-28 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Found that multiple icon-only `<Button size="icon">` components in `apps/www/src/registry/` (such as `SettingsDialog` and `ToggleElement`) were lacking a visually hidden label or `title` / `aria-label`, leading to accessibility issues for screen reader users.
**Action:** Ensure that all icon-only buttons include a visually hidden screen reader label using `<span className="sr-only">Label</span>` to provide an accessible name.
