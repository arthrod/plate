## 2024-05-19 - Accessible Names for Node Toggle Buttons
**Learning:** Icon-only toggle buttons in node-based editors (like `ToggleElement` with `<ChevronRight>`) often lack an accessible name, making them unreadable to screen readers and difficult for keyboard users to understand.
**Action:** Always ensure that icon-only toggle buttons have an accessible name, either via an `aria-label` or a visually hidden `<span className="sr-only">Toggle</span>` element inside the `<Button>`. Follow the existing standard within the codebase, which favors `<span className="sr-only">Toggle</span>`.
