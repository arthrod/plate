## 2025-02-18 - [CopyButton Tooltip Revert]
**Learning:** In highly constrained CI environments (like Cloudflare Workers builds), adding complex component wrappers (Providers, Portals) to frequently instantiated components can lead to build failures.
**Action:** When a UX improvement (Tooltip) causes build instability, revert to a simpler solution (e.g., standard HTML attributes or `sr-only` text changes) that delivers most of the value without the overhead.
