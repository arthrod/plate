## 2024-05-12 - Prevent XSS in Media Nodes
**Vulnerability:** User-provided `unsafeUrl` values in media nodes (`href`, `src`) were inserted directly into the DOM without sanitization, exposing an XSS vector.
**Learning:** When passing user-provided URLs to HTML attributes, they must always be wrapped with `sanitizeUrl` from `platejs`. Importantly, a strict `allowedSchemes` array should NOT be used because it breaks `data:` and `blob:` URIs which PlateJS relies on heavily for local file previews and base64 inline images. A fallback `|| ''` must always be provided.
**Prevention:** Always use `sanitizeUrl(url) || ''` when rendering user-provided URLs in React `src` or `href` attributes, ensuring `blob:` and `data:` schemes are preserved.
