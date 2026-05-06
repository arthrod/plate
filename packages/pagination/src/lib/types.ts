import type { Descendant, PluginConfig, TElement } from 'platejs';

/** Page-size presets recognised by the auto-paginator. */
export type PageSize = 'A4' | 'Letter' | { height: number; width: number };

/** Page margins, in CSS pixels at the editor's base font-size. */
export type PageMargins = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

/**
 * Section-level properties carried on a `section` element. Mirrors a subset of
 * the OOXML `<w:sectPr>` block so that import/export round-trips can stay
 * lossless when the user wires markdown/docx adapters in.
 */
export type SectPr = {
  /** Logical id; used by transforms when scoping operations to a section. */
  id?: string;
  /** Per-section page margins. Falls back to the plugin option default. */
  margins?: PageMargins;
  /** Per-section page size. Falls back to the plugin option default. */
  pageSize?: PageSize;
  /** Numbering style for footnotes scoped to this section. */
  footnoteNumberingRestart?: 'continuous' | 'eachPage' | 'eachSection';
};

export type Section = TElement & {
  type: 'section';
  sectPr?: SectPr;
  children: Descendant[];
};

export type Header = TElement & {
  type: 'header';
  children: Descendant[];
};

export type Footer = TElement & {
  type: 'footer';
  children: Descendant[];
};

export type PageBreak = TElement & {
  type: 'page_break';
  /** True when the user inserted the break; false for auto-paginator output. */
  manual: boolean;
  children: [{ text: '' }];
};

export type BasePaginationConfig = PluginConfig<
  'pagination',
  {
    /** Default page size applied when a section omits its own. */
    pageSize: PageSize;
    /** Default page margins applied when a section omits its own. */
    margins: PageMargins;
    /**
     * When true, the auto-paginator runs inside `withNormalizeNode`. Set false
     * to bypass measurement (useful for headless tests, server rendering, or
     * collaborative back-ends that do not need physical pages).
     */
    autoPaginate: boolean;
  }
>;
