## 2024-05-18 - Added ARIA label to Settings icon button
**Learning:** Found an icon-only settings button in the editor missing accessible text (`<span className="sr-only">Settings</span>`). This is critical because screen readers would otherwise just announce "button" or ignore it completely without text context.
**Action:** Always verify icon-only `<Button size="icon">` components have nested `<span className="sr-only">` text, especially those added as fixed floating action buttons (FABs).
