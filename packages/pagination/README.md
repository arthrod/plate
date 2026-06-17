# @platejs/pagination

Pagination plugin for Plate.

This package models a paginated document as a list of `section` elements at the
root of the editor. Each section owns optional `header` and `footer` children
plus a stream of body blocks broken across pages by explicit `page_break` void
elements (`manual: true` for user-inserted breaks, `manual: false` for breaks
inserted by the auto-paginator).

The auto-paginator runs inside `withNormalizeNode`, measures rendered block
heights with [pretext](https://github.com/chenglou/pretext), and inserts or
removes non-manual `page_break` nodes so that each page fits within the
configured `pageSize` and `margins`.

Footnote references and definitions are scoped per section via
`configurePlugin`, so footnotes flow into the footer of the section that owns
their reference.

## Installation

```bash
npm install @platejs/pagination
```

## Usage

```tsx
import { PaginationPlugin } from '@platejs/pagination/react';
import { createPlateEditor } from 'platejs/react';

const editor = createPlateEditor({
  plugins: [PaginationPlugin],
});
```

## Package Surface

Plugins:

- `BasePaginationPlugin` / `PaginationPlugin`
- `BaseSectionPlugin` / `SectionPlugin`
- `BaseHeaderPlugin` / `HeaderPlugin`
- `BaseFooterPlugin` / `FooterPlugin`
- `BasePageBreakPlugin` / `PageBreakPlugin`

## License

[MIT](../../LICENSE)
