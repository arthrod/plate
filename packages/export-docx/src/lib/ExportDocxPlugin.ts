import type { PluginConfig } from 'platejs';

import { createTSlatePlugin, KEYS } from 'platejs';

import type {
  DocxExportOptions,
  DocxExportResult,
  ExportDocxPluginOptions,
} from './types';

import { downloadDocx, exportEditorToDocx } from './exportEditorToDocx';

/** Plugin configuration for ExportDocxPlugin */
export type ExportDocxConfig = PluginConfig<
  'exportDocx',
  ExportDocxPluginOptions
>;

/**
 * ExportDocxPlugin - Adds DOCX export capability to Plate editors.
 *
 * This plugin provides an editor-level API for exporting content to DOCX format:
 * - `editor.api.exportDocx(options?)` - Export to DOCX Blob
 * - `editor.api.downloadDocx(options?, filename?)` - Export and trigger download
 *
 * @example
 * ```tsx
 * import { ExportDocxPlugin } from '@platejs/export-docx';
 *
 * const plugins = [
 *   // ... other plugins
 *   ExportDocxPlugin.configure({
 *     options: {
 *       defaultOptions: {
 *         fontFamily: 'Arial',
 *         fontSize: 24,
 *         properties: { title: 'My Document' },
 *       },
 *     },
 *   }),
 * ];
 *
 * // Later, in your component:
 * const handleExport = async () => {
 *   await editor.api.downloadDocx({}, 'my-document.docx');
 * };
 * ```
 */
export const ExportDocxPlugin = createTSlatePlugin<ExportDocxConfig>({
  key: KEYS.exportDocx,
  options: {},
}).extendEditorApi(({ editor, getOptions }) => ({
  /**
   * Trigger a download of the editor content as a DOCX file.
   *
   * @param options - Export options (merged with default options)
   * @param filename - Name of the downloaded file (default: 'document.docx')
   */
  downloadDocx: async (
    options?: DocxExportOptions,
    filename = 'document.docx'
  ): Promise<void> => {
    const blob = await exportEditorToDocx(editor, {
      ...getOptions().defaultOptions,
      ...options,
    });
    downloadDocx(blob, filename);
  },

  /**
   * Export the current editor content as DOCX.
   *
   * @param options - Export options (merged with default options)
   * @returns Promise resolving to a Blob containing the DOCX file
   *
   * @example
   * ```ts
   * const blob = await editor.api.exportDocx({
   *   properties: { title: 'My Document' },
   * });
   *
   * // Upload to server
   * const formData = new FormData();
   * formData.append('file', blob, 'document.docx');
   * await fetch('/api/upload', { method: 'POST', body: formData });
   * ```
   */
  exportDocx: (options?: DocxExportOptions): Promise<DocxExportResult> =>
    exportEditorToDocx(editor, {
      ...getOptions().defaultOptions,
      ...options,
    }),
}));
