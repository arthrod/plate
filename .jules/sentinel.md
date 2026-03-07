## 2024-05-24 - Fix reverse tabnabbing in registry link toolbar
**Vulnerability:** Native `<a>` elements with `target="_blank"` used in registry components (e.g., `apps/www/src/registry/ui/link-toolbar.tsx`) lacked `rel="noopener noreferrer"`.
**Learning:** Native `<a>` elements do not receive Next.js `<Link>` auto-protections against reverse tabnabbing attacks and must explicitly include `rel="noopener noreferrer"` to prevent the newly opened tab from accessing the `window.opener` object of the original tab.
**Prevention:** Always ensure `rel="noopener noreferrer"` is included when using `target="_blank"` on native `<a>` elements, especially in shared/registry UI components that don't use Next.js `<Link>`.
