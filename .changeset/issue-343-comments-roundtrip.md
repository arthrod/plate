---
"@platejs/docx-io": minor
---

Add scaffolds for DOCX comment round-trip with `paraId` / `parentParaId` threading. Extends `DocxComment` with optional threading fields (`authorName`, `authorInitials`, `date`, `paraId`, `parentParaId`, `isPoint`, `body`) and exports a new `DocxImportDiscussion` type plus `parseDocxComments`, `applyTrackedCommentsLocal`, and `injectDocxCommentTokens` entry points. The deep token resolver and Mammoth wiring are stubbed pending #342.
