'use client';

import { DocxExportPlugin } from '@platejs/docx-export';

/**
 * Kit for DOCX export functionality.
 *
 * This kit provides the ability to export Plate editor content to DOCX format
 * using the @turbodocx/html-to-docx library.
 *
 * @example
 * ```tsx
 * import { ExportDocxKit } from '@/registry/components/editor/plugins/export-docx-kit';
 *
 * const plugins = [
 *   ...ExportDocxKit,
 *   // other plugins
 * ];
 * ```
 *
 * @example
 * ```tsx
 * // Using the export API directly
 * const docx = await editor.api.docxExport.export({
 *   documentOptions: { title: 'My Document' },
 * });
 * ```
 */
export const ExportDocxKit = [DocxExportPlugin];
