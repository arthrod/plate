## 2024-03-24 - Add ARIA Labels to Icon-Only Buttons
**Learning:** Found multiple instances of icon-only `<Button>` elements across different UI components (`comment`, `code-block`, `code-drawing`, `settings`) that lacked accessible names.
**Action:** Always verify that buttons containing only icons (e.g. `<Settings className="size-4" />`) have an explicitly set `aria-label` attribute to ensure screen reader compatibility.
