## 2025-02-15 - Interactive Toggles Missing State
**Learning:** Custom interactive elements like `Button` used for selection (e.g., in `ThemeCustomizer`) often lack ARIA state attributes (`aria-pressed`, `aria-checked`).
**Action:** When identifying custom toggles or selection groups, check for `aria-pressed` or `role="radiogroup"`/`aria-checked` and add them.
## 2025-02-15 - Duplicate IDs in Reused Components
**Learning:** Components used in multiple contexts (e.g., responsive dialogs/drawers) can cause duplicate ID violations if static IDs are used.
**Action:** Use `React.useId()` to generate unique IDs for accessibility attributes (like `aria-labelledby`) instead of hardcoded strings.
## 2025-02-15 - Build Failures in Mixed Environments
**Learning:** `postinstall` scripts that rely on environment-specific tools (like `bunx`) can cause build failures in CI environments that lack those tools (e.g., Cloudflare Pages).
**Action:** Use environment-agnostic tools (like `npx`) in `package.json` scripts to ensure compatibility across all environments (local, CI, deployment).
