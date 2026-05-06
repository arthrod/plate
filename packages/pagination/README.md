# @platejs/pagination

Render-time overlay pagination for Plate. Pages are derived from the live
document at render time and painted as a chrome overlay (header band,
footer band, footnote well, page borders) above the editor — the Slate
value never changes.

## Install

```bash
npm install @platejs/pagination
```

## Use

```tsx
import { PaginationPlugin } from '@platejs/pagination/react';
import { createPlateEditor } from 'platejs/react';

const editor = createPlateEditor({
  plugins: [
    PaginationPlugin.configure({
      options: {
        // pageSize: preset key or { width, height } in CSS px
        pageSize: 'A4',
        // margins accept px numbers, or CSS strings: '2.54cm', '1in', '12pt'
        margins: { top: '2.54cm', bottom: '2.54cm', left: '3cm', right: '3cm' },
        headerHeight: 48,
        footerHeight: 48,
        footnoteWell: 96,
      },
    }),
  ],
});
```

### Margin units

The `margins` option accepts any of the following units per side:

| Unit  | Example      | CSS px equivalent              |
|-------|--------------|-------------------------------|
| `px`  | `'72px'`     | identity                       |
| `in`  | `'1in'`      | 1 in = 96 px                   |
| `cm`  | `'2.54cm'`   | 1 cm ≈ 37.8 px (96 / 2.54)     |
| `mm`  | `'25.4mm'`   | 1 mm ≈ 3.78 px (96 / 25.4)     |
| `pt`  | `'72pt'`     | 1 pt ≈ 1.33 px (96 / 72)       |
| `number` | `72`      | treated as px directly          |

## API

```ts
editor.api.pagination.getPages();              // Page[]
editor.api.pagination.getPageOf([blockIndex]); // page index, or -1
editor.api.pagination.getFootnotes(0);         // TElement[] for page 0
editor.api.pagination.hasHeader();             // boolean
editor.api.pagination.hasFooter();             // boolean

editor.tf.pagination.insertPageBreak();
editor.tf.pagination.setHeader(content);       // Descendant[]
editor.tf.pagination.setFooter(content);       // Descendant[]
editor.tf.pagination.toggleHeader();           // returns new presence: boolean
editor.tf.pagination.toggleFooter();           // returns new presence: boolean
editor.tf.pagination.setPageSize('Letter');
editor.tf.pagination.setMargins({ top: '2.54cm', bottom: '2.54cm', left: '3cm', right: '3cm' });
editor.tf.pagination.togglePreview();          // returns new visibility: boolean
```

## Architecture

- Pure `paginate(doc, rect, ctx, measurer) -> Page[]` selector — React-free,
  unit-testable with a fake monospace measurer.
- DOM-backed measurer with bounded LRU cache keyed by
  `(node.id, marks-fingerprint, font, width)`.
- Overlay mounted via `render.afterEditable`; `pointer-events: none`
  preserves editing.
- Footnote definitions hidden in flow via injected CSS; visible copy
  rendered inside each page's footer well.

## License

[MIT](../../LICENSE)
