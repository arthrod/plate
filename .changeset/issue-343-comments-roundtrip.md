---
"@platejs/docx-io": minor
---

Add scaffolding for DOCX comment round-trip with `paraId` / `parentParaId` threading. Extends `DocxComment` with optional threading fields (`authorName`, `authorInitials`, `date`, `paraId`, `parentParaId`, `isPoint`, `body`), introduces `DocxImportDiscussion`, and exposes `parseDocxComments`, `applyTrackedCommentsLocal`, and `injectDocxCommentTokens` entry points.
