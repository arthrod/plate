# Plan 3: Header and Footer Repeating on Each Page

## Problem

Headers and footers are authored once as top-level Slate blocks (`HEADER_KEY`, `FOOTER_KEY`) and are already cloned onto each page thumbnail in the side-panel preview via `PageFrame` (`packages/pagination/src/react/page-frame.tsx`). However:

1. When the **page view mode** (Plan 2) is active, no header/footer chrome is rendered inline in the live editor between page sections.
2. The header/footer blocks are visible in the Slate editor flow as regular editable blocks at the top/bottom of the document — users can accidentally place the cursor inside them and break formatting.
3. There is no per-page variable content support (e.g., "Page N of M", section title injection).

## Current State

| Component | File | Notes |
|---|---|---|
| `PageFrame` | `packages/pagination/src/react/page-frame.tsx` | Renders header+footer in thumbnails |
| `ensureHeader` | `packages/pagination/src/lib/transforms/ensureHeader.ts` | Inserts header block at index 0 |
| `ensureFooter` | `packages/pagination/src/lib/transforms/ensureFooter.ts` | Inserts footer block at end |
| `paginate()` | `packages/pagination/src/lib/paginate.ts` | Skips `HEADER_KEY`/`FOOTER_KEY` blocks |
| `enforceHeaderFooterInvariants` | `packages/pagination/src/lib/transforms/enforceHeaderFooterInvariants.ts` | Deduplication only; position unconstrained for footer |

Header/footer already **repeat on every page** inside the side-panel preview. The gap is the **inline page view** and **editor UX polish**.

---

## Goal

1. Render header and footer chrome inline between page sections when page view mode is active (integrates with Plan 2).
2. Polish the in-editor experience for header/footer blocks (read-only, visually distinct).
3. Support simple per-page variables: page number token and total-pages token.

---

## Phase 1 — In-Editor Header/Footer Chrome (Page View Integration)

This phase depends on the `PageDivider` infrastructure from Plan 2.

### 1.1 `PageChrome` component

**File:** `packages/pagination/src/react/page-chrome.tsx` (new)

A non-editable banner rendered at the **start** of each page section (below the `PageDivider`) showing the header content, and at the **end** showing the footer content:

```tsx
export function PageChrome({
  content,        // TElement[] — the header or footer nodes
  pageIndex,
  slot,           // 'header' | 'footer'
  totalPages,
}: PageChromeProps) {
  // Renders content using BlockPreview/InlinePreview (same as PageFrame)
  // Substitutes {{page}} → pageIndex+1, {{totalPages}} → totalPages
  return (
    <div
      contentEditable={false}
      data-plate-pagination-chrome={slot}
      style={{ /* matching PageFrame slot styles */ }}
    >
      <ResolvedContent
        content={content}
        pageIndex={pageIndex}
        totalPages={totalPages}
      />
    </div>
  );
}
```

### 1.2 Integrate `PageChrome` with `PageDividerRenderer`

**File:** `packages/pagination/src/react/pagination-plugin.ts`

When `pageViewVisible` is true, the `belowNodes` renderer (from Plan 2) also emits a `<PageChrome slot="footer" />` before the `<PageDivider />` and a `<PageChrome slot="header" />` after the divider.

The render order for a page boundary becomes:
```
[last block of page N]
<PageChrome slot="footer" pageIndex={N} />
<PageDivider pageNumber={N} />
<PageChrome slot="header" pageIndex={N+1} />
[first block of page N+1]
```

The first page header is rendered via a `beforeNodes` hook on the first block (index 0).

---

## Phase 2 — Editor UX for Header/Footer Blocks

### 2.1 Visual distinction for header/footer in normal view

The header and footer blocks are editable top-level Slate nodes. Without visual framing, users don't know they are special. Add a `withComponent` extension to the `HeaderPlugin` and `FooterPlugin` that wraps the node with a styled label.

**File:** `packages/pagination/src/react/header-plugin.ts`

```ts
export const HeaderPlugin = toPlatePlugin(BaseHeaderPlugin, {
  render: {
    node: HeaderElement,  // new component
  },
});
```

**File:** `packages/pagination/src/react/components/header-element.tsx` (new)

```tsx
export function HeaderElement({ children, ...props }: PlateElementProps) {
  return (
    <PlateElement {...props}>
      <div data-plate-pagination-slot="header-label">Header</div>
      {children}
    </PlateElement>
  );
}
```

Styled with a top border, muted label, and subtle background — matching `PageFrame`'s header slot appearance.

Apply the same pattern to `FooterPlugin` / `FooterElement`.

### 2.2 Prevent header/footer from being selected by `selectAll`

Override `normalizeNode` to skip `HEADER_KEY` and `FOOTER_KEY` when computing selection bounds. This requires an `overrideEditor` on the `PaginationPlugin` that intercepts `editor.tf.select` when range is `[]` and excludes chrome blocks.

### 2.3 Read-only option for header/footer

Add `chromeEditable?: boolean` (default `true`) to `BasePaginationOptions`. When `false`, the header/footer blocks render with `contentEditable={false}` so they cannot be edited inline.

---

## Phase 3 — Per-Page Variables

### 3.1 Token format

Define two substitution tokens resolvable at render time:

| Token | Resolves to |
|---|---|
| `{{page}}` | Current page number (1-based) |
| `{{pages}}` | Total page count |

Tokens are stored as plain text inside the header/footer blocks. No new node types needed.

### 3.2 `resolvePageTokens(content, pageIndex, totalPages)` utility

**File:** `packages/pagination/src/lib/internal/resolve-page-tokens.ts` (new)

```ts
export const resolvePageTokens = (
  nodes: TElement[],
  pageIndex: number,
  totalPages: number
): TElement[] => {
  // Deep-clone nodes, replace text matching /\{\{page\}\}/ and /\{\{pages\}\}/
};
```

This is a pure function — no side effects. Used by both `PageFrame` (thumbnails) and `PageChrome` (page view).

### 3.3 Wire tokens into `PageFrame`

**File:** `packages/pagination/src/react/page-frame.tsx`

Before passing `documentHeader`/`documentFooter` to the `BlockPreview` renderer, run them through `resolvePageTokens(content, page.pageIndex, totalPages)`.

### 3.4 Insert-token transforms

Add two transforms to simplify token insertion:

```ts
editor.tf.pagination.insertPageToken()       // inserts {{page}} at selection
editor.tf.pagination.insertTotalPagesToken() // inserts {{pages}} at selection
```

These call `editor.tf.insertText` with the token string.

---

## Phase 4 — Toolbar Support

### 4.1 Header/footer edit mode

Add a `DropdownMenuItem` to `PaginationToolbarButton` to "Edit header" / "Edit footer":

```tsx
<DropdownMenuItem onSelect={() => {
  editor.tf.pagination.focusHeader();
  setOpen(false);
}}>
  Edit header
</DropdownMenuItem>
```

`focusHeader()` selects the cursor inside the header block at path `[0, 0]`.

### 4.2 Token insertion

When cursor is inside a header/footer block, expose token-insert buttons:

```tsx
{isInsideChrome && (
  <>
    <DropdownMenuItem onSelect={() => tf.insertPageToken()}>
      Insert page number
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => tf.insertTotalPagesToken()}>
      Insert total pages
    </DropdownMenuItem>
  </>
)}
```

---

## Phase 5 — Tests

| Test | File |
|---|---|
| `resolvePageTokens` substitutes `{{page}}` and `{{pages}}` | `resolve-page-tokens.spec.ts` |
| `PageChrome` renders header content with correct page number | `page-chrome.spec.tsx` |
| Token-insert transforms insert correct text | `base-pagination-plugins.spec.ts` |
| Header/footer excluded from `selectAll` range | `base-pagination-plugins.spec.ts` |

---

## Files Touched

| File | Change |
|---|---|
| `packages/pagination/src/lib/types.ts` | Add `chromeEditable`, `insertPageToken`, `insertTotalPagesToken` to API/options |
| `packages/pagination/src/lib/internal/resolve-page-tokens.ts` | New utility |
| `packages/pagination/src/react/page-chrome.tsx` | New component |
| `packages/pagination/src/react/components/header-element.tsx` | New element wrapper |
| `packages/pagination/src/react/components/footer-element.tsx` | New element wrapper |
| `packages/pagination/src/react/header-plugin.ts` | Add `node.component: HeaderElement` |
| `packages/pagination/src/react/footer-plugin.ts` | Add `node.component: FooterElement` |
| `packages/pagination/src/react/page-frame.tsx` | Wire `resolvePageTokens` |
| `packages/pagination/src/react/pagination-plugin.ts` | Wire `PageChrome` into page-view dividers |
| `packages/pagination/src/lib/transforms/` | Add `focusHeader`, `focusFooter`, `insertPageToken`, `insertTotalPagesToken` |
| `packages/pagination/src/react/index.ts` | Barrel (regenerate via `pnpm brl`) |
| `apps/www/src/registry/ui/pagination-toolbar-button.tsx` | Header/footer edit + token-insert items |

## Non-Goals

- Different header/footer per section (requires authoring model changes beyond scope).
- Image insertion into headers/footers (standard media plugin handles this already).
- Running headers (showing current section title dynamically from document content) — future work.