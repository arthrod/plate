import { createSlateEditor } from 'platejs';

import { DocxExportPlugin, KEYS_DOCX_EXPORT } from '../DocxExportPlugin';

// Mock @turbodocx/html-to-docx
mock.module('@turbodocx/html-to-docx', () => ({
  default: mock(() => Promise.resolve(new ArrayBuffer(8))),
}));

// Mock platejs/static
mock.module('platejs/static', () => ({
  serializeHtml: mock(() => Promise.resolve('<p>Test content</p>')),
}));

describe('DocxExportPlugin', () => {
  it('should have the correct key', () => {
    expect(DocxExportPlugin.key).toBe(KEYS_DOCX_EXPORT);
    expect(DocxExportPlugin.key).toBe('docxExport');
  });

  it('should extend editor API with export method', () => {
    const editor = createSlateEditor({
      plugins: [DocxExportPlugin],
      value: [{ children: [{ text: 'Hello' }], type: 'p' }],
    });

    expect(editor.api.docxExport).toBeDefined();
    expect(typeof editor.api.docxExport.export).toBe('function');
  });

  it('should call HtmlToDocx when exporting', async () => {
    const editor = createSlateEditor({
      plugins: [DocxExportPlugin],
      value: [{ children: [{ text: 'Test' }], type: 'p' }],
    });

    const result = await editor.api.docxExport.export();

    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  it('should handle complex editor content', async () => {
    const editor = createSlateEditor({
      plugins: [DocxExportPlugin],
      value: [
        { children: [{ text: 'Heading' }], type: 'h1' },
        {
          children: [
            { bold: true, text: 'Bold text' },
            { text: ' and ' },
            { italic: true, text: 'italic text' },
          ],
          type: 'p',
        },
        {
          children: [{ text: 'A blockquote' }],
          type: 'blockquote',
        },
      ],
    });

    const result = await editor.api.docxExport.export();

    expect(result).toBeInstanceOf(ArrayBuffer);
  });
});
