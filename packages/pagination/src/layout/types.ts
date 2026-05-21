// ============================================================
// pagination/layout/types.ts
//
// The pagination layout contract. Adapted from premirror's deterministic
// snapshot → measure → compose → LayoutOutput pipeline, flattened to Slate's
// block granularity (Slate has no runs; a top-level block is the atomic unit).
//
// The document model never changes — pages are a derived projection.
// ============================================================

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
};

export type ComposeMetrics = {
  pages: number;
  blocks: number;
};

export type LayoutOutput = {
  pages: PageLayout[];
  metrics: ComposeMetrics;
};
