## 2025-02-18 - Centralized Reverse Tabnabbing Protection
**Vulnerability:** Reverse tabnabbing risk for rendered user links (target="_blank" without rel="noopener noreferrer").
**Learning:** Found that `@platejs/link` centrally evaluates all link attributes via `getLinkAttributes.ts`. This acts as a choke point where global link security rules can be applied uniformly across all plate-rendered links.
**Prevention:** Implement `rel="noopener noreferrer"` dynamically for all `target="_blank"` links directly in `getLinkAttributes.ts` to ensure centralized, robust protection against reverse tabnabbing across the entire app instead of hunting down individual link renderings.
