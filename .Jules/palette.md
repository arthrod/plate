## 2025-02-18 - [CopyButton Tooltip Optimization]
**Learning:** Adding complex components (like `Tooltip` which uses Providers and Portals) to frequently used components (like `CopyButton` in `CodeBlock`) can cause build failures (likely OOM or timeout) in constrained environments like Cloudflare Workers.
**Action:** When enhancing widely used components, optimize structure to avoid redundant Context Providers. Added a global `TooltipProvider` to `Providers.tsx` and updated `CopyButton` to use `TooltipPrimitive.Root` directly, bypassing the per-instance `TooltipProvider`.
