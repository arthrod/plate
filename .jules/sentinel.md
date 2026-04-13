## 2024-05-18 - [Add noopener noreferrer for links with target _blank]
**Vulnerability:** Links with target `_blank` without `rel="noopener noreferrer"` can expose the codebase to reverse tabnabbing attacks, allowing the opened page to gain partial access to the `window.opener` object.
**Learning:** Security attributes for rendered links must be applied centrally where attributes are evaluated for rendering (`getLinkAttributes`).
**Prevention:** Always append `noopener noreferrer` to `rel` when `target="_blank"` is dynamically set for a link.
