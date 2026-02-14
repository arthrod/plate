## 2025-02-15 - Interactive Toggles Missing State
**Learning:** Custom interactive elements like `Button` used for selection (e.g., in `ThemeCustomizer`) often lack ARIA state attributes (`aria-pressed`, `aria-checked`).
**Action:** When identifying custom toggles or selection groups, check for `aria-pressed` or `role="radiogroup"`/`aria-checked` and add them.
