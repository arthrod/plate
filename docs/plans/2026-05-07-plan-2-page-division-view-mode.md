# Plan 2: Automatic Page Division — "Page View" Mode

## Problem

The current pagination system (Variant A) paints a **read-only side-panel preview** next to the live editor. There is no in-editor visual representation of page boundaries. Users cannot see where a page break falls while typing.

The user request is for a **new view mode** (toggled via settings) that automatically renders page divisions directly inside the live editor — similar to the "Page Layout" view in Microsoft Word — distinct from the existing manual `insertPageBreak` (section break).

## Current State

| Component | File | Notes |
|---|---|---|
| `PageOverlay` | `packages/pagination/src/react/page-overlay.tsx` | Fixed side panel, not inline |
| `paginate()` | `packages/pagination/src/lib/paginate.ts` | Returns `Page[]` with node membership |
| `usePageLayout` | `packages/pagination/src/react/internal/use-page-layout.ts` | Derives `Page[]` from editor value |
| `previewVisible` | `packages/pagination/src/lib/types.ts:125` | Boolean — controls side panel only |
| `BasePaginationOptions` | `packages/pagination/src/lib/types.ts:94` | No concept of "page view" vs "normal view" |

## Goal

Add a **page view mode** where the live Slate editor renders visual page-break dividers between blocks at derived page boundaries. The dividers are non-editable overlays injected into the editor DOM. They do **not** mutate the Slate document. The mode is toggled separately from the side-panel preview.

---

## Architecture Decision

**Chosen approach: `afterNodes` decorator-based dividers**

Inject a thin non-editable ruler element **after** each block that is the last item on a page. This is done via the `render.aboveNodes` or `render.belowNodes` hook on the `PaginationPlugin`, which wraps each top-level block's rendered output.

This avoids:
- Inserting fake nodes into the Slate document.
- Re-rendering the entire editor when a page boundary shifts.
- Conflicting with the DnD plugin (which reads `data-slate-node` attributes).

---

## Phase 1 — Data Layer

### 1.1 Add `pageViewVisible` option to `BasePaginationOptions`

**File:** `packages/pagination/src/lib/types.ts`

```ts
export type BasePaginationOptions = {
  // ... existing fields ...
  /** Whether the inline page-division view is active. Default: false. */
  pageViewVisible?: boolean;
};
```

### 1.2 Add `togglePageView` transform

**File:** `packages/pagination/src/lib/transforms/` (new file `togglePageView.ts`)

```ts
export const togglePageView = (editor: SlateEditor): boolean => {
  const next = !editor.getOptions(BasePaginationPlugin).pageViewVisible;
  editor.setOptions(BasePaginationPlugin, { pageViewVisible: next });
  return next;
};
```

Wire into `BasePaginationTransforms` and the plugin's `extendEditorTransforms`.

### 1.3 Expose `getPageBoundaryAfter(editor, blockIndex)` query

**File:** `packages/pagination/src/lib/queries/getPageBoundaryAfter.ts`

Returns `true` when the block at `blockIndex` is the **last block on its page** (i.e., a page break should render below it).

```ts
export const getPageBoundaryAfter = (
  editor: SlateEditor,
  blockIndex: number
): boolean => {
  const pages = getEditorPages(editor);
  for (const page of pages) {
    const last = page.nodes.at(-1);
    if (!last) continue;
    const lastIndex = editor.children.indexOf(last as TNode);
    if (lastIndex === blockIndex) return true;
  }
  return false;
};
```

---

## Phase 2 — React Renderer

### 2.1 `PageDivider` component

**File:** `packages/pagination/src/react/page-divider.tsx` (new)

A non-editable React element rendered between pages:

```tsx
export function PageDivider({ pageNumber }: { pageNumber: number }) {
  return (
    <div
      contentEditable={false}
      data-plate-page-divider
      style={{
        alignItems: 'center',
        color: '#9ca3af',
        display: 'flex',
        fontSize: 11,
        gap: 8,
        margin: '24px -72px',  // bleeds past editor margins
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <hr style={{ flex: 1, borderTop: '1px dashed #d1d5db' }} />
      <span>Page {pageNumber + 1}</span>
      <hr style={{ flex: 1, borderTop: '1px dashed #d1d5db' }} />
    </div>
  );
}
```

### 2.2 `usePageDividers` hook

**File:** `packages/pagination/src/react/internal/use-page-dividers.ts` (new)

```ts
export const usePageDividers = (): Set<number> => {
  const pages = usePluginOption(PaginationPlugin, /* subscribe to page state */);
  // Returns a Set of block indices after which a divider should render.
  const boundaries = useMemo(() => {
    const set = new Set<number>();
    for (const page of pages) {
      const last = page.nodes.at(-1);
      if (last) set.add(/* last block index */);
    }
    return set;
  }, [pages]);
  return boundaries;
};
```

### 2.3 Wire dividers via `render.belowNodes`

**File:** `packages/pagination/src/react/pagination-plugin.ts`

In the `PaginationPlugin` extension:

```ts
render: {
  belowNodes: PageDividerRenderer,
  afterEditable: PageOverlay,
}
```

`PageDividerRenderer` is a component that:
1. Reads `pageViewVisible` from plugin options.
2. Reads the current `pages` from the editor slot.
3. For each rendered block, checks if it is a page-boundary block.
4. If yes, renders a `<PageDivider pageNumber={...} />` after the block.

Because `belowNodes` receives the current element's path, the component can check `path[0]` against the page-boundary set.

---

## Phase 3 — Toolbar Integration

### 3.1 Add `togglePageView` to `PaginationToolbarButton`

**File:** `apps/www/src/registry/ui/pagination-toolbar-button.tsx`

Add a new `DropdownMenuCheckboxItem`:

```tsx
<DropdownMenuCheckboxItem
  checked={!!pageViewVisible}
  onCheckedChange={() => tf.togglePageView()}
>
  <LayoutIcon />
  Page view
</DropdownMenuCheckboxItem>
```

### 3.2 Settings persistence

Store `pageViewVisible` in plugin options (already reactive via `setOptions`). Consumers who want persistence should serialize it to `localStorage` or their own store; the plugin does not own persistence.

---

## Phase 4 — Interaction Details

### 4.1 Cursor handling near dividers

The `PageDivider` element has `contentEditable={false}` and `pointerEvents: none`. Slate's default `beforeInput` and cursor logic does not interact with `contentEditable={false}` children, so no special handling is needed for cursor jumping over dividers.

### 4.2 DnD compatibility

DnD block-drag relies on `data-slate-node` attributes. `PageDivider` carries `data-plate-page-divider` (non-standard), so DnD will not misidentify it as a Slate block.

### 4.3 Print CSS

When the page view is active, add `@media print` CSS:

```css
[data-plate-page-divider] {
  display: none;
}
```

Print rendering uses native browser page breaks; the dividers are editorial aids only.

### 4.4 Interaction with `insertPageBreak` (manual break)

Manual page-break nodes (`PAGE_BREAK_KEY`) already force a flush in `paginate()`. The automatic dividers follow naturally: the `pageBreak` block will be the last on its logical page, so a `PageDivider` renders below it. No special-casing needed.

---

## Phase 5 — Tests

| Test | File |
|---|---|
| `togglePageView` toggles `pageViewVisible` | `base-pagination-plugins.spec.ts` |
| `getPageBoundaryAfter` returns correct indices | new `getPageBoundaryAfter.spec.ts` |
| `PageDivider` renders with correct page number | `page-divider.spec.tsx` |
| Dividers do not render when `pageViewVisible=false` | `pagination-plugin.spec.tsx` |

---

## Files Touched

| File | Change |
|---|---|
| `packages/pagination/src/lib/types.ts` | Add `pageViewVisible` to `BasePaginationOptions`; add `togglePageView` to `BasePaginationTransforms` |
| `packages/pagination/src/lib/transforms/togglePageView.ts` | New transform |
| `packages/pagination/src/lib/transforms/index.ts` | Barrel re-export |
| `packages/pagination/src/lib/queries/getPageBoundaryAfter.ts` | New query |
| `packages/pagination/src/lib/queries/index.ts` | Barrel re-export |
| `packages/pagination/src/react/page-divider.tsx` | New component |
| `packages/pagination/src/react/internal/use-page-dividers.ts` | New hook |
| `packages/pagination/src/react/pagination-plugin.ts` | Wire `render.belowNodes` |
| `packages/pagination/src/react/index.ts` | Barrel re-export (regenerate via `pnpm brl`) |
| `apps/www/src/registry/ui/pagination-toolbar-button.tsx` | Add page-view toggle item |

## Non-Goals

- Mutating the Slate document to track page boundaries.
- Replacing the existing side-panel preview (they coexist).
- Paginating inside table cells or nested editors.