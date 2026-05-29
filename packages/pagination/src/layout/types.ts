// ============================================================
// pagination/layout/types.ts
//
// The pagination layout contract. Adapted from premirror's deterministic
// snapshot → measure → compose → LayoutOutput pipeline, flattened to Slate's
// block granularity (Slate has no runs; a top-level block is the atomic unit).
//
// The document model never changes — pages are a derived projection.
// ============================================================

import type { MappingIndex } from './mapping';

export type PagePreset = 'a4' | 'letter';

export type PageSpec = {
  widthPx: number;
  heightPx: number;
  preset?: PagePreset;
};

export type PageMargins = {
  topPx: number;
  rightPx: number;
  bottomPx: number;
  leftPx: number;
};

/**
 * Chrome render context — handed to a `PageChromeSpec.render` so the consumer
 * can produce page-number-aware content. Pure: no DOM access expected.
 */
export type ChromeRenderContext = {
  /** Zero-based page index. */
  pageIndex: number;
  /** Total page count in the current layout. */
  pageCount: number;
  /** Page spec for this page (width/height). */
  page: PageSpec;
  /** Page margins (the chrome sits INSIDE these, not outside). */
  margins: PageMargins;
};

/**
 * Page-chrome spec: a reserved horizontal band at the top (header) or bottom
 * (footer) of each page. The band height SHRINKS the content frame the composer
 * has available for block packing; the rendered content is supplied by `render`
 * and painted by the overlay as an absolute sibling of the editable.
 *
 * PRETEXT-safe: `render` MUST NOT call DOM APIs, mutate the editor, or read
 * scroll state. It receives a pure {@link ChromeRenderContext} and returns any
 * ReactNode. Page-number content reads directly off `pageIndex` / `pageCount`.
 */
export type PageChromeSpec = {
  /** Reserved band height, in CSS px. */
  heightPx: number;
  /** Pure-function render. Called once per page when the layout changes. */
  render: (ctx: ChromeRenderContext) => unknown;
};

/**
 * Frame-relative chrome rectangle for one page, emitted by composeLayout when
 * chrome is configured. The overlay uses these rects to anchor chrome content —
 * no DOM measurement of the chrome itself is needed.
 */
export type PageChromeRect = {
  /** Page-local Y (relative to the page's top edge), in CSS px. */
  y: number;
  /** Band height (matches the configured `heightPx`). */
  heightPx: number;
  /** Page content width = page.widthPx - margins.leftPx - margins.rightPx. */
  widthPx: number;
  /** Page-local X (= margins.leftPx). */
  x: number;
};

/** Pagination break policies (widow/orphan/keep-with-next). */
export type LayoutPolicies = {
  /** Min lines kept at the top of a page for a split block. */
  widowLinesMin: number;
  /** Min lines kept at the bottom of a page for a split block. */
  orphanLinesMin: number;
  /** Keep a block (e.g. heading) with the following block. */
  keepWithNextEnabled: boolean;
};

/** Pure inputs to {@link composeLayout}. */
export type LayoutInput = {
  page: PageSpec;
  margins: PageMargins;
  policies: LayoutPolicies;
  /**
   * Optional page chrome. Header sits BELOW the top margin, footer sits ABOVE
   * the bottom margin. Both reduce the content frame's available height; both
   * are anchored using composer-computed geometry so they never drift with
   * scroll. The render functions are stored OUTSIDE the layout output (they
   * live on the plugin options); the composer only needs `heightPx` here.
   */
  chrome?: {
    header?: { heightPx: number };
    footer?: { heightPx: number };
  };
};

/**
 * A top-level block with its real measured geometry. Built by the measurement
 * pass from the rendered DOM (height at the page content width), then fed to
 * the pure composer.
 */
export type MeasuredBlock = {
  /** Stable id (used for caching + fragment grouping). */
  id: string;
  /** Slate path of the top-level block (e.g. `[3]`). */
  path: number[];
  /** Measured rendered height at the content width, in CSS px. */
  heightPx: number;
  /**
   * Rendered flow height = text height + the block's own vertical box spacing
   * (margins/padding/border) the DOM adds around it. Used for page *packing*
   * (which block fits per page) so the engine matches real DOM flow. Falls back
   * to {@link heightPx} when absent. `heightPx`/`lineCount` stay text-only so
   * line-level mapping is unaffected.
   */
  flowHeightPx?: number;
  /** Measured line height, in CSS px (>= 1). */
  lineHeightPx: number;
  /** Number of text lines (>= 1), derived from height / lineHeight. */
  lineCount: number;
  /** Keep this block on the same page as the next block. */
  keepWithNext?: boolean;
  /** Force a page break before this block. */
  breakBefore?: boolean;
  /**
   * Whether the block may be split across pages. Atomic blocks (tables,
   * images, void) are placed whole and pushed to the next page if they don't
   * fit. Defaults to true.
   */
  splittable?: boolean;
};

export type MeasuredSnapshot = {
  blocks: MeasuredBlock[];
};

/**
 * A top-level block before measurement. Built from the Slate value; carries the
 * stable id (for measurement caching + fragment grouping), path, type, and
 * pagination hints derived from the node/type.
 */
export type UnmeasuredBlock = {
  id: string;
  path: number[];
  type: string;
  /** Concatenated text of the block, used for line measurement. */
  text: string;
  keepWithNext?: boolean;
  breakBefore?: boolean;
  splittable?: boolean;
};

export type UnmeasuredSnapshot = {
  blocks: UnmeasuredBlock[];
};

export type BreakReason =
  | 'block_overflow'
  | 'manual_break'
  | 'keep_with_next'
  | 'widow_orphan';

export type Rect = { x: number; y: number; width: number; height: number };

/**
 * A placed (sub)range of a block on a single page. A block that spans pages
 * produces multiple fragments sharing `blockId` with distinct `fragmentIndex`.
 */
export type BlockFragment = {
  blockId: string;
  path: number[];
  fragmentIndex: number;
  /** First line index of this fragment within the whole block. */
  lineStart: number;
  /** Number of lines in this fragment. */
  lineCount: number;
  /** Frame-relative top, in CSS px. */
  y: number;
  /** Fragment height, in CSS px. */
  heightPx: number;
  /** Set on the FIRST fragment of a page when the page break was non-trivial. */
  breakReason?: BreakReason;
};

export type FrameLayout = {
  /** Page-relative content rectangle (page minus margins). */
  bounds: Rect;
  fragments: BlockFragment[];
};

export type PageLayout = {
  index: number;
  spec: PageSpec;
  frames: FrameLayout[];
  /**
   * Reserved rects for header/footer chrome, in page-local coordinates.
   * Absent when no chrome configured. Identical across every page in a single
   * layout (chrome is layout-wide, not per-page); kept per-page so the overlay
   * can map them to document-Y via the page's known top without extra plumbing.
   */
  chrome?: {
    header?: PageChromeRect;
    footer?: PageChromeRect;
  };
};

export type ComposeMetrics = {
  pages: number;
  blocks: number;
};

export type LayoutOutput = {
  pages: PageLayout[];
  metrics: ComposeMetrics;
  /**
   * Position index over {@link pages}, built once during composition. Consumers
   * (projection, selection) read this instead of rebuilding it per call.
   */
  mapping: MappingIndex;
};
