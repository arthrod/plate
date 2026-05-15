## 2024-05-18 - Prevent XSS by sanitizing media URLs
**Vulnerability:** User-provided URLs for media (video, audio, files) and tags were passed directly to `href` or `src` attributes without sanitization, leading to a Cross-Site Scripting (XSS) vulnerability via `javascript:` URIs.
**Learning:** `unsafeUrl` from `useMediaState` is explicitly named as such because it is unsanitized. It must never be passed directly to a DOM element's `src` or `href` attribute. React does not sanitize `javascript:` URIs natively in these attributes.
**Prevention:** Always wrap user-provided URLs in `sanitizeUrl(url, {}) || ''` from `platejs` before passing them to HTML attributes. Do not use a strict `allowedSchemes` array as it breaks `data:` and `blob:` URIs used heavily by PlateJS.
