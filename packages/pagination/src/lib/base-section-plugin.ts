import { createSlatePlugin, KEYS } from 'platejs';

/**
 * Top-level container that owns one document section. Holds an optional
 * `header`, the body blocks (with embedded `page_break` voids), and an
 * optional `footer`. The `sectPr` data lives on the element itself, mirroring
 * OOXML so that DOCX adapters can round-trip it without a side channel.
 */
export const BaseSectionPlugin = createSlatePlugin({
  key: KEYS.section,
  node: {
    isContainer: true,
    isElement: true,
  },
});
