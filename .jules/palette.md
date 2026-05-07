## 2024-03-20 - Ensure sr-only labels in icon-only buttons
**Learning:** Found multiple instances where `size="icon"` buttons in CodeBlockElement components lack accessible text (`<span className="sr-only">...</span>`) for screen readers, or standard tooltips. This is critical for users navigating via keyboard and screen readers, as an icon on its own lacks context.
**Action:** Always add an explicit accessible label (like `aria-label` or visually hidden text) to all `<Button size="icon">` components.
