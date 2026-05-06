/**
 * Plugin keys hard-coded inside the package so the published `platejs`
 * `KEYS` object isn't required to know about them. The workspace `KEYS`
 * also exposes these (`KEYS.pagination`, `KEYS.pageBreak`) for downstream
 * consumers that prefer the central registry — keep these strings in sync.
 */
export const PAGINATION_KEY = 'pagination';
export const PAGE_BREAK_KEY = 'pageBreak';
export const HEADER_KEY = 'header';
export const FOOTER_KEY = 'footer';
export const FOOTNOTE_REFERENCE_KEY = 'footnoteReference';
export const FOOTNOTE_DEFINITION_KEY = 'footnoteDefinition';
