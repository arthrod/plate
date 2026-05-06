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
      pageSize: 'A4',
      margins: { top: 96, bottom: 96, left: 72, right: 72 },
      headerHeight: 48,
      footerHeight: 48,
      footnoteWell: 96,
    }),
  ],
});
```

## API

```ts
editor.api.pagination.getPages(); // Page[]
editor.api.pagination.getPageOf([blockIndex]); // page index, or -1
editor.api.pagination.getFootnotes(0); // footnote definitions on page 0

editor.tf.pagination.insertPageBreak();
editor.tf.pagination.setHeader(content);
editor.tf.pagination.setFooter(content);
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
