---
'@platejs/docx-io': minor
---

`htmlToDocxBlob` now accepts an optional `chrome: { headerHtml?, footerHtml? }` argument and emits the matching `word/headerN.xml` / `word/footerN.xml` parts plus `w:headerReference` / `w:footerReference` inside `w:sectPr`. `importDocx` extracts the section properties (`pageSize`, `margins`, `orientation`) and surfaces referenced header / footer parts as plain-text `DocxChromeBlock` entries on the result — enables paginated round-trip with `@platejs/pagination`.
