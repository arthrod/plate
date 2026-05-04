import type { KEYS, Descendant, PluginConfig, TElement } from 'platejs';

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
  type: typeof KEYS.section;
  sectPr?: SectPr;
  children: Descendant[];
};

export type Header = TElement & {
  type: typeof KEYS.header;
  children: Descendant[];
};

export type Footer = TElement & {
  type: typeof KEYS.footer;
  children: Descendant[];
};

export type PageBreak = TElement & {
  type: typeof KEYS.pageBreak;
  /** True when the user inserted the break; false for auto-paginator output. */
  manual: boolean;
  children: [{ text: '' }];
};

export type BasePaginationConfig = PluginConfig<
  typeof KEYS.pagination,
  {
    /**
     * When true, the auto-paginator runs inside `withNormalizeNode`. Set false
     * to bypass measurement (useful for headless tests, server rendering, or
     * collaborative back-ends that do not need physical pages).
     */
    autoPaginate: boolean;
    /**
     * When true, `enforceSectionInvariants` will wrap loose root blocks into a
     * `Section`. Defaults to `false` to avoid silently rewriting existing
     * documents on first install. Consumers with prior content should run a
     * one-shot migration adapter, then enable this only for new documents.
     */
    autoEnforceSections?: boolean;
    /** Default page margins applied when a section omits its own. */
    margins: PageMargins;
    /** Default page size applied when a section omits its own. */
    pageSize: PageSize;
  }
>;
