## 2024-11-20 - Defense against reverse tabnabbing for Target Blank Links
**Vulnerability:** Links with `target="_blank"` rendered by the Plate Editor did not consistently include `rel="noopener noreferrer"`.
**Learning:** This exposes users to reverse tabnabbing attacks, where the newly opened tab can gain a reference to the `window.opener` object of the originating page and potentially navigate it to a malicious site.
**Prevention:** Always append `rel="noopener noreferrer"` to anchor tags (`<a>`) or Next.js `<Link>` components when `target="_blank"`, especially when rendering user-generated content like rich text editor links in `@platejs/link`.
