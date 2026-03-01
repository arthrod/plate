/**
 * Browser entry point for @platejs/docx-io
 *
 * This entry re-exports the full API using the browserified mammoth bundle
 * and Blob-based html-to-docx. Both vendored libraries work with Blob/ArrayBuffer
 * in browser environments without Node.js dependencies.
 */

export * from '../lib/index';
