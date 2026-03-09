## 2025-03-09 - Fix XSS Vulnerability in Media File Nodes
**Vulnerability:** The `MediaFileNode` and `MediaFileNodeStatic` components in the UI registry passed raw `url` and `unsafeUrl` properties directly to the `href` attribute of `<a>` tags.
**Learning:** This allowed for Cross-Site Scripting (XSS) attacks if an attacker provided a `javascript:` URI as the file URL. Even if a property is named `unsafeUrl`, it might still be used unsafely in UI components.
**Prevention:** Always use `sanitizeUrl` (or a similar sanitization utility) to wrap user-provided URLs before passing them to `href` or `src` attributes in React components.
