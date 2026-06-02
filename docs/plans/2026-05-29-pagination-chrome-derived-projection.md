# Pagination chrome — derived-projection design

**Date:** 2026-05-29
**Author:** Claude Opus 4.7 (1M context)
**Status:** Proposed, ready to implement against `work/pagination-synthesized`

## What this adds

Headers, footers, and page numbers — plus first-class margin sizing — for the
Plate pagination plugin, **without any DOM mutation** and **without any
document-tree mutation**. Page chrome is computed during the same
`composeLayout` pass that places block fragments, and rendered by the overlay
as absolutely-positioned siblings of the existing break-line overlay.

This honors the `30183540f` architectural commitment ("remove document-mutating
engine; pagination is derived projection") that the PRETEXT branch family
established.

## Constraint recap

1. **No DOM modification.** The chrome cannot append `<div>` elements inside the
   editable `<contenteditable>`, cannot inject `::before`/`::after` pseudo-elements
   that the contenteditable would treat as content, and cannot wrap blocks.
2. **No document-tree modification.** The chrome cannot insert nodes into
   `editor.children` — no headers-as-paragraphs, no footers-as-paragraphs.
3. **PRETEXT measurement.** Chrome content height must be measurable from the
   text alone (`measureTextLines`), not by rendering and reading `getBoundingClientRect()`.

## Architecture

```
LayoutInput  +  Chrome  →  composeLayout  →  LayoutOutput +  Chrome rects
                                                 │
                                                 ↓
                                     overlay paints chrome
                                     in reserved rects
                                     above + below content
```

The overlay already paints break-lines as absolute siblings; it gains two more
absolute siblings per page (header band, footer band) anchored to the reserved
rectangles the composer hands back.

## Type extensions

`packages/pagination/src/layout/types.ts`:

```ts
/**
 * Chrome occupies fixed horizontal bands at the top + bottom of each page,
 * inside the page margins but outside the content frame. Specified at the
 * options layer; reserved by the composer; rendered by the overlay.
 */
export type PageChromeSpec = {
  /** Reserved band, in CSS px. 0 means no chrome (default). */
  heightPx: number;
  /**
   * Pure-function that renders a single page's chrome content. Pretext-safe —
   * the render function MUST NOT call DOM APIs or mutate the editor. Return
   * any React node; the overlay paints it inside the chrome rect.
   *
   * Called once per page during render (not during compose), and again only
   * when the layout output changes. Receives the page index (zero-based) and
   * the total page count so consumers can render `Page 3 of 7` style numbers.
   */
  render: (ctx: ChromeRenderContext) => React.ReactNode;
};

export type ChromeRenderContext = {
  /** Zero-based page index for this chrome render. */
  pageIndex: number;
  /** Total page count in the current layout. */
  pageCount: number;
  /** The page's spec (width/height) for layout-aware chrome. */
  page: PageSpec;
  /** The page's margins (the chrome sits INSIDE these). */
  margins: PageMargins;
};

export type LayoutInput = {
  page: PageSpec;
  margins: PageMargins;
  policies: LayoutPolicies;
  /** Optional page chrome. Header sits below the top margin, footer above the
   *  bottom margin. Both reduce the content frame's available height. */
  chrome?: {
    header?: PageChromeSpec;
    footer?: PageChromeSpec;
  };
};

export type PageChromeRect = {
  /** Frame-relative top, in CSS px (relative to the page top, inside margins). */
  y: number;
  /** Chrome band height. */
  heightPx: number;
  /** Page-content width (page width minus left/right margins). */
  widthPx: number;
};

export type PageLayout = {
  index: number;
  spec: PageSpec;
  frames: FrameLayout[];
  /** Reserved rects for header/footer chrome; absent when no chrome configured. */
  chrome?: {
    header?: PageChromeRect;
    footer?: PageChromeRect;
  };
};
```

## Compose extension

`packages/pagination/src/layout/compose.ts`:

```ts
const headerHeightPx = input.chrome?.header?.heightPx ?? 0;
const footerHeightPx = input.chrome?.footer?.heightPx ?? 0;
const contentBounds: Rect = {
  x: margins.leftPx,
  // Content starts BELOW the header band, which sits inside the top margin.
  y: margins.topPx + headerHeightPx,
  width: page.widthPx - margins.leftPx - margins.rightPx,
  // Content height shrinks by both bands.
  height: page.heightPx - margins.topPx - margins.bottomPx - headerHeightPx - footerHeightPx,
};

// … existing packing logic uses `contentBounds.height` for frameHeight,
// no other changes needed (the packer is already height-driven).

// When a PageLayout is finalised, attach its chrome rects:
const chromeFor = (pageIndex: number): PageLayout['chrome'] | undefined => {
  if (!input.chrome) return undefined;
  const widthPx = page.widthPx - margins.leftPx - margins.rightPx;
  return {
    header: input.chrome.header
      ? { y: margins.topPx, heightPx: input.chrome.header.heightPx, widthPx }
      : undefined,
    footer: input.chrome.footer
      ? {
          y: page.heightPx - margins.bottomPx - input.chrome.footer.heightPx,
          heightPx: input.chrome.footer.heightPx,
          widthPx,
        }
      : undefined,
  };
};
```

## Plugin options extension

`packages/pagination/src/lib/BasePaginationPlugin.ts`:

```ts
export type PaginationOptions = {
  // … existing fields …
  /**
   * Page chrome (headers + footers + page numbers). Each band reserves
   * vertical space and renders inside that reserved rect via the overlay.
   * Pretext-style: the render function MUST be a pure ReactNode producer;
   * it MUST NOT mutate the document or the DOM.
   */
  chrome?: {
    header?: PageChromeSpec;
    footer?: PageChromeSpec;
  };
};

const DEFAULT_OPTIONS: PaginationOptions = {
  // … existing fields …
  chrome: undefined,
};
```

## React overlay extension

`packages/pagination/src/react/PaginationPlugin.tsx`:

The overlay component already iterates pages and paints break-lines. It gains
two more siblings per page:

```tsx
{layout.pages.map((page) => (
  <Fragment key={page.index}>
    {/* existing break-line at page boundary */}
    {page.chrome?.header && (
      <div
        aria-hidden="true"
        className="plate-pagination-chrome plate-pagination-chrome--header"
        style={anchorChrome(page, page.chrome.header)}
      >
        {options.chrome?.header?.render({
          pageIndex: page.index,
          pageCount: layout.pages.length,
          page: page.spec,
          margins: editor.getOption(BasePaginationPlugin, 'margins'),
        })}
      </div>
    )}
    {page.chrome?.footer && (
      <div
        aria-hidden="true"
        className="plate-pagination-chrome plate-pagination-chrome--footer"
        style={anchorChrome(page, page.chrome.footer)}
      >
        {options.chrome?.footer?.render(/* same ctx */)}
      </div>
    )}
  </Fragment>
))}
```

`aria-hidden="true"` because the chrome is decorative, not editable content —
screen readers should hear only the document.

## Built-in page-number renderer

A convenience export for the common case:

```ts
// packages/pagination/src/react/chrome/PageNumber.tsx
export const PageNumber: PageChromeSpec['render'] = ({ pageIndex, pageCount }) => (
  <span className="plate-pagination-page-number">
    Page {pageIndex + 1} of {pageCount}
  </span>
);

// Usage:
PaginationPlugin.configure({
  chrome: {
    footer: { heightPx: 32, render: PageNumber },
    header: {
      heightPx: 28,
      render: ({ pageIndex }) =>
        pageIndex === 0 ? null : <span>Northwind MSA</span>,
    },
  },
});
```

## Pretext-safe header measurement

Because the chrome's `heightPx` is consumer-supplied (the consumer knows the
font, the content, and the desired band height), we don't need DOM
measurement here at all. If a future feature wants auto-sized chrome (e.g.
"shrink to fit content"), it would use the same `measureTextLines` primitive
the document body uses:

```ts
// Future extension — not in this PR:
const measuredHeight = measureTextLines(text, { widthPx, font });
```

## Tests

### Unit: `packages/pagination/src/layout/__tests__/compose-chrome.spec.ts`

1. **No chrome → bounds unchanged.** Existing tests should pass unchanged.
2. **Header height subtracts from content frame.** A page with header.heightPx=40
   has 40 fewer px to pack fragments into; assert via `metrics.pages` and
   `page.frames[0].bounds.height`.
3. **Footer height subtracts symmetrically.** Same as above, footer side.
4. **Header + footer combine.** Both bands reserve simultaneously; content
   shrinks by `header.heightPx + footer.heightPx`.
5. **Chrome rects geometry.** Header.y == margins.topPx; footer.y ==
   page.heightPx - margins.bottomPx - footer.heightPx; both widthPx ==
   page.widthPx - margins.leftPx - margins.rightPx.
6. **Per-page rects.** Every page in `layout.pages` gets the same chrome rects
   (chrome geometry is per-page identical; only the rendered CONTENT may vary).

### Unit: `packages/pagination/src/react/chrome/__tests__/PageNumber.spec.tsx`

1. Renders `Page N of M` with correct values for index 0 and last page.
2. `render` accepts a custom format function.
3. Returns `null` when the configured render returns null (consumer suppresses
   first-page chrome, common for cover pages).

### Pretext: `packages/pagination/src/measure/__tests__/chrome-pretext.spec.ts`

1. Verify chrome heightPx flows into composeLayout WITHOUT reading any DOM.
2. (Future) `measureTextLines` for chrome auto-sizing — placeholder test.

### E2E: `templates/plate-playground-template/tests/pagination-chrome.spec.ts`

(Playwright; lives alongside existing pagination e2e under
`templates/plate-playground-template/tests/`.)

1. **Header renders on every page.** Type enough content for >= 3 pages; assert
   `.plate-pagination-chrome--header` count equals page count.
2. **Page numbers update on edit.** Add content, assert footer text changes
   from `Page 1 of 2` to `Page 1 of 3`.
3. **Toggle pagination off → chrome disappears.** Click the toolbar button;
   assert no chrome elements remain.
4. **Margin change re-anchors chrome.** Configure smaller margins; assert
   chrome rects' `widthPx` increases by the difference.

## Out of scope (deliberate)

- **Per-section headers/footers** (different chrome for §1 vs §2). Would require
  a `chromeSelector` ranging over block paths. Doable but adds policy surface.
- **Even/odd page chrome.** Trivial extension on the consumer's render function
  (`pageIndex % 2 === 0`); no plugin change needed.
- **Auto-sizing chrome.** As noted under "Pretext-safe header measurement";
  postpone until a concrete consumer asks for it.
- **Chrome interactivity** (clickable footer, etc.). Chrome is `aria-hidden` and
  not contenteditable; if a consumer wants interactive chrome they can paint
  pointer-events:auto and handle events — but that's their call, not ours.

## Implementation order

1. `types.ts` — extend `LayoutInput`, `PageLayout` with chrome fields.
2. `compose.ts` — subtract chrome heights from frame bounds; emit chrome rects.
3. `BasePaginationPlugin.ts` — extend `PaginationOptions` with `chrome`.
4. `PaginationPlugin.tsx` — render chrome bands in the overlay.
5. `react/chrome/PageNumber.tsx` — convenience export.
6. Tests — unit + pretext + e2e (in that order).
7. Update `templates/plate-playground-template` to demo the new options.
8. Changeset.

Estimated diff: ~250 lines added, ~10 lines changed.
