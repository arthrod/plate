# Plan 4: Docx Export Wiring for Pagination

## Problem

The `@platejs/pagination` package is completely decoupled from docx I/O. Exporting a paginated document via `packages/docx-io` does not produce:

- Hard page breaks at `PAGE_BREAK_KEY` nodes.
- Page margins from `BasePaginationOptions.margins`.
- Page size from `BasePaginationOptions.pageSize`.
- Repeated header/footer blocks as Word's native header/footer sections.

## Current State

| Component | File | Notes |
|---|---|---|
| `DocxExportPlugin` | `packages/docx-io/src/lib/docx-export-plugin.tsx` | No pagination awareness |
| `exportToDocx()` | `packages/docx-io/src/lib/docx-export-plugin.tsx:483` | Accepts `margins`, `orientation`; no `pageSize`, no header/footer |
| `DocxDocument` | `packages/docx-io/src/lib/internal/docx-document.ts` | Has `header`, `footer`, `headerObjects`, `footerObjects`, `pageSize`, `margins` fields |
| `PageBreakElementStatic` | `packages/pagination/src/static/page-break-element-static.tsx` | Renders print-CSS page break but not consumed by docx-io |
| `DocxExportOptions` | `packages/docx-io/src/lib/docx-export-plugin.tsx` | `margins` in TWIPs, no page size, no header/footer |

The pipeline is: **Plate value → `serializeToHtml()` → `htmlToDocxBlob()` → DOCX ZIP**. Page-break CSS (`page-break-after: always`) does not survive the HTML→OOXML conversion in `@turbodocx/html-to-docx`.

---

## Goal

Wire pagination metadata (page breaks, margins, page size, header/footer) into the docx export so that the output `.docx` file faithfully represents the paginated document.

---

## Architecture Decision

**Chosen approach: pre-process the Plate value before serialization, not post-process the HTML/XML.**

Reasons:
1. The HTML→DOCX converter (`@turbodocx/html-to-docx`) does not guarantee round-trip fidelity for page-break CSS.
2. The `DocxDocument` class already has native header/footer XML generation (`headerObjects`, `footerObjects`).
3. Inserting `<w:br w:type="page"/>` XML directly is the most reliable way to produce page breaks in OOXML.

---

## Phase 1 — Page Break Serialization

### 1.1 `PageBreakElementStatic` renders a Word-compatible page-break span

**File:** `packages/pagination/src/static/page-break-element-static.tsx`

Current implementation renders a visual divider with print CSS. Extend it to also render a zero-width `<span>` with a `data` attribute that `docx-io` can detect:

```tsx
<span data-docx-page-break="true" style={{ display: 'none' }} />
```

This survives the static-HTML serialization step without visual impact.

### 1.2 `serializeToHtml` detection

**File:** `packages/docx-io/src/lib/docx-export-plugin.tsx`

After `serializeToHtml()` produces an HTML string, run a pre-DOCX pass to locate `data-docx-page-break="true"` spans and replace them with the canonical OOXML paragraph marker:

```ts
const DOCX_PAGE_BREAK_SPAN = /<span[^>]*data-docx-page-break="true"[^>]*><\/span>/g;

html = html.replace(DOCX_PAGE_BREAK_SPAN, PAGE_BREAK_OOXML_PLACEHOLDER);
```

Where `PAGE_BREAK_OOXML_PLACEHOLDER` is a temporary token (`@@DOCX_PAGE_BREAK@@`) that the VTree post-processor converts to:

```xml
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

### 1.3 VTree post-processor in `convertVTreeToXML`

**File:** `packages/docx-io/src/lib/internal/helpers/render-document-file.ts`

In `convertVTreeToXML()`, detect nodes with the placeholder text and emit the `<w:br w:type="page"/>` element directly. This keeps the XML-building concern inside `docx-document.ts`.

---

## Phase 2 — Margins and Page Size

### 2.1 Extend `DocxExportOptions`

**File:** `packages/docx-io/src/lib/docx-export-plugin.tsx`

```ts
export type DocxExportOperationOptions = {
  customStyles?: string;
  fontFamily?: string;
  margins?: DocxExportMargins; // existing — in TWIPs
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'Letter' | 'Legal' | { height: number; width: number }; // new
  title?: string;
};
```

### 2.2 `convertPageSize(pageSize: PageSize): DocxPageSize`

**File:** `packages/pagination/src/lib/internal/page-size-presets.ts` (already has `PAGE_PRESETS` in px)

Add a conversion function that emits TWIPs for use in OOXML:

```ts
// 1 CSS px = 15 TWIPs (at 96 DPI / 1440 TWIPs per inch)
const PX_TO_TWIP = 15;

export const pageSizeToDocx = (size: PageSize): { w: number; h: number } => {
  const { width, height } = resolvePageSize(size);
  return { w: Math.round(width * PX_TO_TWIP), h: Math.round(height * PX_TO_TWIP) };
};
```

### 2.3 Pass page size into `DocxDocument`

In `exportToDocx()`, if `options.pageSize` is set, resolve and pass it to `DocxDocument`'s constructor via the `pageSize` property it already exposes.

### 2.4 `convertMargins(margins: PageMargins): DocxExportMargins`

**File:** new utility in `packages/pagination/src/lib/internal/margins-to-docx.ts`

```ts
export const marginsToDocx = (m: PageMargins): DocxExportMargins => ({
  top:    Math.round(m.top    * PX_TO_TWIP),
  right:  Math.round(m.right  * PX_TO_TWIP),
  bottom: Math.round(m.bottom * PX_TO_TWIP),
  left:   Math.round(m.left   * PX_TO_TWIP),
});
```

---

## Phase 3 — Header and Footer Export

### 3.1 Header/footer extraction from Plate value

Before calling `serializeToHtml()`, extract header and footer blocks from the editor value:

```ts
const headerType = editor.getType(HEADER_KEY);
const footerType = editor.getType(FOOTER_KEY);
const headerNodes = value.filter(n => (n as TElement).type === headerType);
const footerNodes = value.filter(n => (n as TElement).type === footerType);
// Strip header/footer from content so they don't appear in body
const bodyNodes = value.filter(n => !headerNodes.includes(n) && !footerNodes.includes(n));
```

### 3.2 Serialize header/footer HTML separately

Serialize `headerNodes` and `footerNodes` to HTML using the same `serializeToHtml()` utility but with body-only wrapper:

```ts
const headerHtml = await serializeToHtml({ ...opts, value: headerNodes });
const footerHtml = await serializeToHtml({ ...opts, value: footerNodes });
```

### 3.3 Pass to `DocxDocument`

**File:** `packages/docx-io/src/lib/docx-export-plugin.tsx`

The `DocxDocument` class already has a `header` boolean, `headerObjects` array, and `createHeader()` method. Pass the serialized HTML to create header/footer:

```ts
if (headerHtml) {
  docxDoc.header = true;
  docxDoc.headerObjects.push({
    type: 'default',
    html: headerHtml,
  });
}
```

The `@turbodocx/html-to-docx` library already supports header/footer via the `DocumentOptions.header` / `DocumentOptions.footer` fields and the `headerHTMLString` / `footerHTMLString` options.

### 3.4 Page-number tokens in headers/footers

Word's native page-number field (`<w:fldChar>`, `<w:instrText>PAGE</w:instrText>`) must replace `{{page}}` tokens. Add a pre-pass on the header/footer HTML:

```ts
headerHtml = headerHtml.replace(/\{\{page\}\}/g, WORD_PAGE_NUMBER_FIELD_HTML);
headerHtml = headerHtml.replace(/\{\{pages\}\}/g, WORD_TOTAL_PAGES_FIELD_HTML);
```

Where `WORD_PAGE_NUMBER_FIELD_HTML` is a sentinel that the XML builder converts to `<w:fldChar w:fldCharType="begin"/><w:instrText> PAGE </w:instrText><w:fldChar w:fldCharType="end"/>`.

---

## Phase 4 — `PaginationDocxPlugin` (Opt-in Bridge)

Rather than coupling `docx-io` directly to `@platejs/pagination`, create a thin bridge plugin in the pagination package:

**File:** `packages/pagination/src/react/pagination-docx-plugin.ts` (new)

```ts
import { createTPlatePlugin } from 'platejs/react';
import type { DocxExportOperationOptions } from '@platejs/docx-io';

export const PaginationDocxPlugin = createTPlatePlugin({
  key: 'paginationDocx',
  extendEditorTransforms: ({ editor }) => ({
    paginationDocx: {
      buildDocxOptions(): Partial<DocxExportOperationOptions> {
        const opts = editor.getOptions(BasePaginationPlugin);
        return {
          margins: marginsToDocx(opts.margins),
          pageSize: opts.pageSize,
          // header/footer extraction is done by the export plugin
        };
      },
    },
  }),
});
```

Usage:

```ts
const docxOptions = editor.tf.paginationDocx.buildDocxOptions();
await editor.tf.docxExport.exportAndDownload('document.docx', docxOptions);
```

---

## Phase 5 — Tests

| Test | File |
|---|---|
| `PAGE_BREAK_KEY` node exports as `<w:br w:type="page"/>` | `docx-export-pagination.spec.ts` |
| A4 page size exports correct TWIP dimensions | `page-size-presets.spec.ts` |
| Margins in CSS px convert correctly to TWIPs | `margins-to-docx.spec.ts` |
| Header block content appears in DOCX header section | `docx-export-pagination.spec.ts` |
| `{{page}}` in header becomes Word PAGE field | `docx-export-pagination.spec.ts` |

---

## Files Touched

| File | Change |
|---|---|
| `packages/pagination/src/static/page-break-element-static.tsx` | Emit `data-docx-page-break` sentinel span |
| `packages/pagination/src/lib/internal/page-size-presets.ts` | Add `pageSizeToDocx()` |
| `packages/pagination/src/lib/internal/margins-to-docx.ts` | New conversion utility |
| `packages/pagination/src/react/pagination-docx-plugin.ts` | New bridge plugin |
| `packages/pagination/src/react/index.ts` | Barrel (regenerate via `pnpm brl`) |
| `packages/docx-io/src/lib/docx-export-plugin.tsx` | Page-break detection, extended options, header/footer wiring |
| `packages/docx-io/src/lib/internal/helpers/render-document-file.ts` | VTree page-break conversion |
| `packages/pagination/package.json` | Add optional `@platejs/docx-io` peer dep |
| `apps/www/src/registry/ui/pagination-toolbar-button.tsx` | Add "Export to DOCX" action using bridge plugin |

## Non-Goals

- Round-trip import: importing a DOCX with headers/footers back into a paginated Plate editor.
- CSS-exact fidelity in exported headers/footers (Word has its own style model).
- Per-section different headers/footers (requires authoring model changes).
