## 2026-03-26 - Prevent Reverse Tabnabbing
**Vulnerability:** External links using `target="_blank"` without `rel="noopener noreferrer"` allow the newly opened page to gain partial control over the original page via `window.opener`, potentially redirecting it to a malicious site (Reverse Tabnabbing).
**Learning:** Even internal UI components linking to external sites (like documentation or social media) need strict `rel` attributes to prevent exploitation, especially in web applications using React/Next.js.
**Prevention:** Always use `rel="noopener noreferrer"` whenever using `target="_blank"` on an anchor tag (`<a>`) or framework specific Link components.
