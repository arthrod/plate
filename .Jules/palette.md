## 2025-02-18 - [CopyButton Tooltip]
**Learning:** `CopyButton` component is widely used but lacked visual feedback (tooltip) and screen reader context for the "Copied!" state. The `Tooltip` component in `apps/www` conveniently wraps `TooltipProvider`, simplifying usage but requiring care to avoid double-wrapping in consuming components.
**Action:** When enhancing common UI components, check all usages to ensure no conflicts (e.g. nested providers) and consistently apply accessibility improvements (ARIA labels, state updates).
