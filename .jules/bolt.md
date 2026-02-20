## 2024-05-23 - Unnecessary `mounted` check in HOCs causing double renders
**Learning:** High-order components like `withTooltip` that use `useState` to track `mounted` status force a double render for every instance on mount. Modern UI libraries (like Radix UI) handle hydration gracefully, making this check redundant and performance-negative.
**Action:** Remove `mounted` checks in HOCs unless specifically required for non-SSR-safe libraries. Verify that the wrapped component handles hydration correctly.
