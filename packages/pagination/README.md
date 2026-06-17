# @platejs/pagination

Pagination plugin for Plate.

This package models a paginated document as a list of `section` elements at the
root of the editor. Each section owns optional `header` and `footer` children
plus a stream of body blocks broken across pages by explicit `page_break` void
elements (`manual: true` for user-inserted breaks, `manual: false` for breaks
inserted by the auto-paginator).

> **Status: scaffold.** The auto-paginator inside `withNormalizeNode`,
> [pretext](https://github.com/chenglou/pretext)-based block-height measurement,
> automatic insertion/removal of non-manual `page_break` nodes, and section-
> scoped footnote routing via `configurePlugin` are all wired up as
> `TODO(#358)` placeholders. The current package ships the public KEYS,
> plugin shells, types, and React lifts so consumers can register the plugin
> and the algorithm body can land in a follow-up without breaking the API.

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
