## 2025-02-27 - O(1) Lookups for Static Lists in Render
**Learning:** In React components, using `Array.find` inside a `useMemo` dependency array or render loop on a static list creates an O(n) operation that runs repeatedly (e.g., when cursor changes or on typing). This creates unnecessary overhead.
**Action:** Always derive a `Map` outside the component scope for static lists, allowing O(1) lookups during render. This is a crucial React optimization pattern for toolbars or any UI driven by static mappings.
