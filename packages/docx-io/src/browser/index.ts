/**
 * Browser entry point for @platejs/docx-io
 *
 * This entry keeps Blob-based DOCX export (`htmlToDocxBlob`) for browser usage.
 * Use the root entry for Node/server-safe `htmlToDocxBuffer`.
 */

export { htmlToDocxBlob } from '../lib/exportDocx';
export * from '../lib/index';
