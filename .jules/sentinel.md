## 2024-04-05 - Reverse Tabnabbing Vulnerability in Links
**Vulnerability:** Reverse tabnabbing vulnerability where `target="_blank"` links lack `rel="noopener noreferrer"`.
**Learning:** This repo lacked centralized protection against reverse tabnabbing. It's critical to add `noopener noreferrer` to `target="_blank"` links to prevent the newly opened tab from having a reference to the `window.opener` of the original document.
**Prevention:** Always append `rel="noopener noreferrer"` to external links that open in a new tab (`target="_blank"`).
