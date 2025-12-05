import { createSlateEditor } from 'platejs';

import { exportEditorToDocx } from '../exportEditorToDocx';

// Mock @turbodocx/html-to-docx
mock.module('@turbodocx/html-to-docx', () => ({
  default: mock(() => Promise.resolve(new ArrayBuffer(8))),
}));

// Mock platejs/static
mock.module('platejs/static', () => ({
  serializeHtml: mock(() => Promise.resolve('<p>Serialized content</p>')),
}));

describe('exportEditorToDocx', () => {
  it('should export editor content to DOCX', async () => {
    const editor = createSlateEditor({
      value: [{ children: [{ text: 'Hello World' }], type: 'p' }],
    });

    const result = await exportEditorToDocx(editor);

    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  it('should handle complex editor content', async () => {
    const editor = createSlateEditor({
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

    const result = await exportEditorToDocx(editor);

    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  it('should use provided HTML instead of serializing', async () => {
    const editor = createSlateEditor({
      value: [{ children: [{ text: 'Test' }], type: 'p' }],
    });

    const customHtml = '<p>Pre-generated HTML</p>';
    const result = await exportEditorToDocx(editor, { html: customHtml });

    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  it('should handle null header and footer', async () => {
    const editor = createSlateEditor({
      value: [{ children: [{ text: 'Test' }], type: 'p' }],
    });

    const result = await exportEditorToDocx(editor, {
      footerHtml: null,
      headerHtml: null,
    });

    expect(result).toBeInstanceOf(ArrayBuffer);
  });
});
