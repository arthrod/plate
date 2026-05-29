// ============================================================
// pagination/lib/pageSetup.ts
//
// Document-level page configuration, persisted as a single void `page_setup`
// node at the TOP of the Slate value (children[0]). This keeps page geometry,
// page-number placement, footnote mode, and header/footer chrome content INSIDE
// the document JSON — they travel with the document and round-trip through any
// Slate serializer — while the pagination engine skips the node during layout
// (see buildSnapshot `skipTypes`). The node is the source of truth; the React
// host resolves it into the pure layout pipeline's inputs.
// ============================================================

import type { SlateEditor, TElement } from 'platejs';

import type { PageMargins, PageSpec } from '../layout/types';
import type { LengthUnit } from '../layout/units';

import { getPresetPageSpec } from '../layout/presets';

/** Node type for the document-level page-setup metadata node. */
export const PAGE_SETUP_KEY = 'page_setup';

/** Running page-number rendering style. */
export type PageNumberFormat =
  | 'arabic' // 1, 2, 3
  | 'custom' // customText with {n}/{total} placeholders
  | 'none'
  | 'roman-lower' // i, ii, iii
  | 'roman-upper'; // I, II, III

/** Which band the page-number line sits in (its own one-line band). */
export type PageNumberLocation = 'bottom' | 'none' | 'top';

/** Horizontal alignment of the page number within its full-width band. */
export type PageNumberAlign = 'center' | 'left' | 'right';

/** Max length of a custom page-number template. */
export const PAGE_NUMBER_CUSTOM_MAX = 500;

/**
 * Page-number config: its own one-line band above the header (`top`) or below
 * the footer (`bottom`). `format` and `location` are reciprocal — see
 * {@link normalizePageNumber}.
 */
export type PageNumberConfig = {
  align: PageNumberAlign;
  /** Template with `{n}`/`{total}`; clamped to {@link PAGE_NUMBER_CUSTOM_MAX}. */
  customText?: string;
  /** Omit the number on page 1 (cover-page convention). */
  differentFirstPage?: boolean;
  format: PageNumberFormat;
  location: PageNumberLocation;
};

/**
 * Keep `format`/`location` from being half-set: if one is real while the other
 * is `'none'`, auto-pick the first real option of the other (format→`arabic`,
 * location→`top`).
 */
export function normalizePageNumber(c: PageNumberConfig): PageNumberConfig {
  const hasFormat = c.format !== 'none';
  const hasLocation = c.location !== 'none';
  if (hasFormat && !hasLocation) return { ...c, location: 'top' };
  if (hasLocation && !hasFormat) return { ...c, format: 'arabic' };

  return c;
}

/** Footnote rendering mode for the document. */
export type FootnoteMode = 'endnote' | 'footnote' | 'off';

/** Typography for a chrome region (header/footer/footnote/page-number text). */
export type ChromeTextStyle = {
  bold?: boolean;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  italic?: boolean;
};

/**
 * Editable content of a chrome region. Provide `html` for rich content
 * (inline bold/italic from a contentEditable; author-authored, rendered as-is)
 * or `text` for plain content; `html` wins when both are set. `style` applies
 * region-level typography (font family/size/color) on top.
 */
export type ChromeContent = {
  html?: string;
  style?: ChromeTextStyle;
  text?: string;
};

/** Whether a chrome region has any authored content. */
export function hasChromeContent(content: ChromeContent | undefined): boolean {
  return Boolean(content?.text?.trim() || content?.html?.trim());
}

/**
 * The full page-setup record stored on the `page_setup` node. Geometry is
 * canonical CSS px @ 96dpi; `unit` is the author's working unit, kept only so
 * the settings UI can round-trip the displayed numbers without drift.
 */
export type PageSetupConfig = {
  footer?: ChromeContent;
  /** Typography for footnote/endnote text. */
  footnoteStyle?: ChromeTextStyle;
  footnotes: FootnoteMode;
  header?: ChromeContent;
  margins: PageMargins;
  page: PageSpec;
  pageNumber: PageNumberConfig;
  /** Typography for the running page-number text (overrides the band's style). */
  pageNumberStyle?: ChromeTextStyle;
  /** Author's working unit for the settings UI (geometry is always px). */
  unit: LengthUnit;
};

/** The Slate node carrying {@link PageSetupConfig}. Void, non-content. */
export type TPageSetupElement = TElement & {
  config: PageSetupConfig;
  type: typeof PAGE_SETUP_KEY;
};

/** US Letter + 1in margins + inches working unit; chrome off by default. */
export const DEFAULT_PAGE_SETUP: PageSetupConfig = {
  footnotes: 'off',
  margins: { bottomPx: 96, leftPx: 96, rightPx: 96, topPx: 96 },
  page: getPresetPageSpec('letter'),
  pageNumber: { align: 'center', format: 'none', location: 'none' },
  unit: 'in',
};

/**
 * Read the page setup from a Slate value (the document's node array), or `null`
 * when it has no leading `page_setup` node. Prefer this in React render paths:
 * pair it with a reactive value (`useEditorValue()`) so the read re-runs when
 * the document changes, instead of memoizing on a stable `editor` reference.
 */
export function pageSetupFromValue(
  value: readonly { type?: string }[] | undefined
): PageSetupConfig | null {
  const first = value?.[0] as TPageSetupElement | undefined;
  if (!first || first.type !== PAGE_SETUP_KEY) return null;

  return first.config;
}

/**
 * Read the document's page setup, or `null` when the document has no
 * `page_setup` node. Reads the leading node only — the normalizer guarantees a
 * single `page_setup` node lives at `children[0]`.
 */
export function getPageSetup(editor: SlateEditor): PageSetupConfig | null {
  return pageSetupFromValue(editor.children);
}

/**
 * Upsert the document's page setup. When no `page_setup` node exists, inserts
 * one at `children[0]` seeded with {@link DEFAULT_PAGE_SETUP}; otherwise merges
 * `patch` into the existing config. Always leaves exactly one leading node.
 *
 * @example
 * setPageSetup(editor, { page: getPresetPageSpec('a4'), unit: 'cm' });
 */
export function setPageSetup(
  editor: SlateEditor,
  patch: Partial<PageSetupConfig>
): void {
  const current = getPageSetup(editor);

  if (current) {
    editor.tf.setNodes<TPageSetupElement>(
      { config: { ...current, ...patch } },
      { at: [0] }
    );

    return;
  }

  editor.tf.insertNodes<TPageSetupElement>(
    {
      children: [{ text: '' }],
      config: { ...DEFAULT_PAGE_SETUP, ...patch },
      type: PAGE_SETUP_KEY,
    },
    { at: [0] }
  );
}
