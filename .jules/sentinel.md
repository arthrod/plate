## 2024-05-24 - [Fix reverse tabnabbing for blank targets]
**Vulnerability:** Links with target="_blank" without rel="noopener noreferrer" can allow the newly opened page to access the original page's window.opener object, potentially leading to reverse tabnabbing phishing attacks, and can unnecessarily leak referrer headers.
**Learning:** Found that when configuring link attributes, if a user's link element sets target to _blank, we were unconditionally propagating it without appending the necessary noopener and noreferrer relationship tokens for security.
**Prevention:** Ensured getLinkAttributes automatically handles this logic natively, parsing existing rel strings into a Set, adding the safe tokens, and recombining them. This centralizes the fix for all rendered Plate links.
