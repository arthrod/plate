## 2024-03-XX - Missing asChild prop on Link-wrapped Buttons.
**Learning:** Nested interactive elements (`button > a`) cause invalid HTML and a11y issues with screen readers.
**Action:** Always add `asChild` to `Button` components when using them as wrappers for `Link`.
