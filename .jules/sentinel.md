## 2024-05-24 - Add rel="noopener noreferrer" to external links
**Vulnerability:** Reverse tabnabbing vulnerability via target="_blank" links without rel="noopener noreferrer".
**Learning:** The `@platejs/link` package evaluates global security attributes for rendered links in `packages/link/src/lib/utils/getLinkAttributes.ts`. We must ensure all links with target="_blank" conditionally append `rel="noopener noreferrer"`.
**Prevention:** Include `rel="noopener noreferrer"` for any `a` tag rendered dynamically by the editor with `target="_blank"`.
