## 2024-05-23 - CopyButton UX and Accessibility
**Learning:** Icon-only buttons (like copy buttons) need both visual feedback (tooltips) and accessible feedback (sr-only text updates) to be effective. Relying on icon change alone is insufficient for many users. Also, `useEffect` timeouts for state reset must be cleaned up to prevent memory leaks in client components.
**Action:** Always wrap icon-only action buttons in Tooltips and ensure `sr-only` text reflects the current state (e.g., "Copy" -> "Copied").
