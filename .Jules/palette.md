## 2024-05-24 - Dynamic Feedback for Copy Buttons
**Learning:** Copy buttons should provide immediate visual feedback (tooltip) and auditory feedback (aria-live or dynamic sr-only text) to confirm the action. A `setTimeout` is needed to revert the state.
**Action:** Always implement a `hasCopied` state that toggles the tooltip text to "Copied!" and the screen reader text to "Copied" for a short duration.
