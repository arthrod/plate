## 2025-03-09 - Fix XSS in Media Nodes
**Vulnerability:** User-provided URLs (`unsafeUrl` or `url` from props) in registry media components (`media-audio-node`, `media-video-node`, `media-image-node`, `media-file-node`) were directly passed to `src` or `href` HTML attributes without being sanitized, allowing potential XSS vulnerabilities via `javascript:` URIs.
**Learning:** React components acting as node renderers for external URLs must ensure those URLs are explicitly sanitized before rendering them into the DOM.
**Prevention:** Always wrap external or user-provided URLs with the `sanitizeUrl` utility from `platejs` (e.g., `src={sanitizeUrl(unsafeUrl)}`) in React components before passing them to `href` or `src` attributes.

## 2025-03-09 - Fix XSS in Media Embed Nodes
**Vulnerability:** The `media-embed-node.tsx` component assigned the `embed!.url` value directly to the `src` attribute of an `iframe` element without validating or sanitizing it first, allowing potential XSS vulnerabilities (e.g., via `javascript:` URIs).
**Learning:** External or user-provided URLs in embed components must always be sanitized before being passed to HTML attributes like `src` or `href`, regardless of upstream parsing, to ensure defense in depth against XSS.
**Prevention:** Consistently use the `sanitizeUrl` utility from `platejs` (e.g., `sanitizeUrl(embed!.url, { allowedSchemes: ['http', 'https'] })`) to wrap URLs in React components acting as node renderers.
