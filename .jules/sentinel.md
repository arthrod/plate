## 2025-03-09 - Fix XSS in Media Nodes
**Vulnerability:** User-provided URLs (`unsafeUrl` or `url` from props) in registry media components (`media-audio-node`, `media-video-node`, `media-image-node`, `media-file-node`) were directly passed to `src` or `href` HTML attributes without being sanitized, allowing potential XSS vulnerabilities via `javascript:` URIs.
**Learning:** React components acting as node renderers for external URLs must ensure those URLs are explicitly sanitized before rendering them into the DOM.
**Prevention:** Always wrap external or user-provided URLs with the `sanitizeUrl` utility from `platejs` (e.g., `src={sanitizeUrl(unsafeUrl)}`) in React components before passing them to `href` or `src` attributes.

## 2025-03-18 - Fix Reverse Tabnabbing Vulnerability
**Vulnerability:** Native HTML anchor (`<a>`) tags with `target="_blank"` were missing the `rel="noopener noreferrer"` attribute, allowing newly opened tabs to potentially hijack the original page via `window.opener`.
**Learning:** While Next.js `<Link>` components automatically handle this protection, native `<a>` tags in the application (like in `apps/www/src/components/` and `apps/www/src/registry/`) do not receive these automatic protections and remain vulnerable.
**Prevention:** Always explicitly include `rel="noopener noreferrer"` when using native `<a target="_blank">` tags across the codebase.
