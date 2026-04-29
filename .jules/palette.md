## 2024-05-24 - Add ARIA label to Settings icon button
**Learning:** Found an icon-only button without an accessible name (`sr-only` span or `aria-label`) in the `settings-dialog.tsx` component.
**Action:** Add `<span className="sr-only">Settings</span>` to the button.
