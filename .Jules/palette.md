## 2025-02-18 - [Build Stability vs Features]
**Learning:** Even minor component changes (like state additions or refactors) can destabilize complex builds in sensitive environments (like Cloudflare Workers with memory limits).
**Action:** When a feature causes persistent CI failures, prioritize build stability by reverting to a known good state and finding a lower-risk alternative (e.g., purely static HTML attributes like `aria-label`).
