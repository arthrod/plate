/**
 * @jest-environment jsdom
 */

import { createSlateEditor } from 'platejs';

import { ExportDocxPlugin } from '../ExportDocxPlugin';
import { exportEditorToDocx } from '../exportEditorToDocx';

const createEditor = (value = [{ children: [{ text: '' }], type: 'p' }]) =>
  createSlateEditor({
    plugins: [ExportDocxPlugin],
    value,
  });

describe('exportEditorToDocx', () => {
  it('should export HTML string to DOCX blob', async () => {
    const editor = createEditor();
    const html = '<p>Hello World</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle multiple paragraphs', async () => {
    const editor = createEditor();
    const html = `
      <p>First paragraph</p>
      <p>Second paragraph</p>
      <p>Third paragraph</p>
    `;

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle headings', async () => {
    const editor = createEditor();
    const html = `
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <p>Regular paragraph</p>
    `;

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle inline formatting', async () => {
    const editor = createEditor();
    const html = `
      <p>This has <strong>bold</strong> and <em>italic</em> text.</p>
      <p>This has <u>underline</u> and <s>strikethrough</s> text.</p>
    `;

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle nested formatting', async () => {
    const editor = createEditor();
    const html = `
      <p>This has <strong><em>bold and italic</em></strong> text.</p>
    `;

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should apply document properties', async () => {
    const editor = createEditor();
    const html = '<p>Content</p>';

    const blob = await exportEditorToDocx(editor, {
      html,
      properties: {
        creator: 'Test Author',
        description: 'Test Description',
        subject: 'Test Subject',
        title: 'Test Document',
      },
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should apply custom font settings', async () => {
    const editor = createEditor();
    const html = '<p>Content with custom font</p>';

    const blob = await exportEditorToDocx(editor, {
      fontFamily: 'Times New Roman',
      fontSize: 28, // 14pt
      html,
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should apply custom page settings', async () => {
    const editor = createEditor();
    const html = '<p>Content</p>';

    const blob = await exportEditorToDocx(editor, {
      html,
      margins: {
        bottom: 720,
        left: 720,
        right: 720,
        top: 720,
      },
      pageSize: {
        height: 15_840,
        orientation: 'landscape',
        width: 12_240,
      },
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle empty content', async () => {
    const editor = createEditor();
    const html = '';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle header HTML', async () => {
    const editor = createEditor();
    const html = '<p>Main content</p>';
    const headerHtml = '<p>Document Header</p>';

    const blob = await exportEditorToDocx(editor, { headerHtml, html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle footer HTML', async () => {
    const editor = createEditor();
    const html = '<p>Main content</p>';
    const footerHtml = '<p>Page Footer - Confidential</p>';

    const blob = await exportEditorToDocx(editor, { footerHtml, html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle both header and footer HTML', async () => {
    const editor = createEditor();
    const html = '<p>Main content</p>';
    const headerHtml = '<p><strong>Company Name</strong></p>';
    const footerHtml = '<p>Page 1 of 1</p>';

    const blob = await exportEditorToDocx(editor, {
      footerHtml,
      headerHtml,
      html,
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle formatted header and footer', async () => {
    const editor = createEditor();
    const html = '<p>Document body</p>';
    const headerHtml = '<p style="text-align: center"><strong>CONFIDENTIAL</strong></p>';
    const footerHtml = '<p style="text-align: right"><em>Draft Version</em></p>';

    const blob = await exportEditorToDocx(editor, {
      footerHtml,
      headerHtml,
      html,
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle custom HTML document wrapper', async () => {
    const editor = createEditor();
    const html = '<p>Content</p>';

    const blob = await exportEditorToDocx(editor, {
      createHtmlDocument: ({ editorHtml }) =>
        `<html><body><div class="wrapper">${editorHtml}</div></body></html>`,
      html,
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe('ExportDocxPlugin', () => {
  it('should add exportDocx API to editor', () => {
    const editor = createEditor();

    expect(editor.api.exportDocx).toBeDefined();
    expect(typeof editor.api.exportDocx).toBe('function');
  });

  it('should add downloadDocx API to editor', () => {
    const editor = createEditor();

    expect(editor.api.downloadDocx).toBeDefined();
    expect(typeof editor.api.downloadDocx).toBe('function');
  });

  it('should merge default options with export options', async () => {
    const editor = createSlateEditor({
      plugins: [
        ExportDocxPlugin.configure({
          options: {
            defaultOptions: {
              fontFamily: 'Calibri',
              fontSize: 22,
              properties: {
                creator: 'Default Author',
              },
            },
          },
        }),
      ],
      value: [{ children: [{ text: 'Hello' }], type: 'p' }],
    });

    // The export should work with default options
    const blob = await editor.api.exportDocx({
      html: '<p>Test content</p>',
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});
/** @jsx jsx */
import { jsx } from '@platejs/test-utils';
import { createSlateEditor } from '@udecode/plate-core';
import { describe, expect, it } from 'bun:test';
import { exportEditorToDocx } from '../exportEditorToDocx';

jsx; // Required to prevent JSX pragma removal

describe('exportEditorToDocx - Edge Cases and Error Handling', () => {
  describe('Empty and Null Cases', () => {
    it('should handle completely empty editor', async () => {
      const editor = createSlateEditor({
        value: [],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
      expect(result instanceof Blob).toBe(true);
    });

    it('should handle editor with only empty paragraphs', async () => {
      const editor = createSlateEditor({
        value: [
          { type: 'p', children: [{ text: '' }] },
          { type: 'p', children: [{ text: '' }] },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle null text nodes gracefully', async () => {
      const editor = createSlateEditor({
        value: [
          { 
            type: 'p', 
            children: [
              { text: 'Valid text' },
              { text: null as any },
              { text: undefined as any },
            ] 
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });
  });

  describe('Complex Nested Structures', () => {
    it('should handle deeply nested lists', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'ul',
            children: [
              {
                type: 'li',
                children: [
                  { type: 'lic', children: [{ text: 'Level 1' }] },
                  {
                    type: 'ul',
                    children: [
                      {
                        type: 'li',
                        children: [
                          { type: 'lic', children: [{ text: 'Level 2' }] },
                          {
                            type: 'ul',
                            children: [
                              {
                                type: 'li',
                                children: [
                                  { type: 'lic', children: [{ text: 'Level 3' }] },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle mixed list types (ul and ol)', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'ul',
            children: [
              {
                type: 'li',
                children: [
                  { type: 'lic', children: [{ text: 'Unordered item' }] },
                  {
                    type: 'ol',
                    children: [
                      {
                        type: 'li',
                        children: [
                          { type: 'lic', children: [{ text: 'Ordered subitem' }] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle tables with merged cells', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'table',
            children: [
              {
                type: 'tr',
                children: [
                  {
                    type: 'th',
                    colspan: 2,
                    children: [{ type: 'p', children: [{ text: 'Merged Header' }] }],
                  },
                ],
              },
              {
                type: 'tr',
                children: [
                  {
                    type: 'td',
                    children: [{ type: 'p', children: [{ text: 'Cell 1' }] }],
                  },
                  {
                    type: 'td',
                    children: [{ type: 'p', children: [{ text: 'Cell 2' }] }],
                  },
                ],
              },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });
  });

  describe('Text Formatting Edge Cases', () => {
    it('should handle overlapping text marks', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'p',
            children: [
              { text: 'Bold and italic', bold: true, italic: true, underline: true },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle special characters in text', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'p',
            children: [
              { text: 'Special chars: <>&"\'©®™' },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle very long text content', async () => {
      const longText = 'A'.repeat(10000);
      const editor = createSlateEditor({
        value: [
          {
            type: 'p',
            children: [{ text: longText }],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
      expect(result.size).toBeGreaterThan(0);
    });

    it('should handle unicode and emoji', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'p',
            children: [
              { text: 'Unicode: 你好 مرحبا שלום' },
              { text: 'Emoji: 😀🎉🚀' },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });
  });

  describe('Link and Image Handling', () => {
    it('should handle links with special characters in URL', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'p',
            children: [
              {
                type: 'a',
                url: 'https://example.com/path?param=value&other=test',
                children: [{ text: 'Complex URL' }],
              },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle images with data URLs', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'img',
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            children: [{ text: '' }],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle missing image URLs gracefully', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'img',
            url: '',
            children: [{ text: '' }],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });
  });

  describe('Custom Options', () => {
    it('should respect custom document properties', async () => {
      const editor = createSlateEditor({
        value: [
          { type: 'p', children: [{ text: 'Test content' }] },
        ],
      });

      const result = await exportEditorToDocx(editor, {
        creator: 'Test Creator',
        title: 'Test Document',
        description: 'Test Description',
      });

      expect(result).toBeDefined();
    });

    it('should handle custom filename option', async () => {
      const editor = createSlateEditor({
        value: [
          { type: 'p', children: [{ text: 'Test' }] },
        ],
      });

      const customFilename = 'custom-export-name.docx';
      const result = await exportEditorToDocx(editor, {
        filename: customFilename,
      });

      expect(result).toBeDefined();
    });

    it('should handle custom converter functions', async () => {
      const editor = createSlateEditor({
        value: [
          { type: 'custom-block', children: [{ text: 'Custom content' }] },
        ],
      });

      let converterCalled = false;
      const result = await exportEditorToDocx(editor, {
        nodeConverters: {
          'custom-block': () => {
            converterCalled = true;
            return null;
          },
        },
      });

      expect(result).toBeDefined();
      expect(converterCalled).toBe(true);
    });
  });

  describe('Block Quotes and Code Blocks', () => {
    it('should handle nested blockquotes', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'blockquote',
            children: [
              { type: 'p', children: [{ text: 'Quote level 1' }] },
              {
                type: 'blockquote',
                children: [
                  { type: 'p', children: [{ text: 'Quote level 2' }] },
                ],
              },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle code blocks with multiple lines', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'code_block',
            lang: 'typescript',
            children: [
              { type: 'code_line', children: [{ text: 'function test() {' }] },
              { type: 'code_line', children: [{ text: '  return true;' }] },
              { type: 'code_line', children: [{ text: '}' }] },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle code blocks with special characters', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'code_block',
            children: [
              { type: 'code_line', children: [{ text: 'const x = "<>&";' }] },
              { type: 'code_line', children: [{ text: 'const y = `${x}`;' }] },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });
  });

  describe('Headings and Hierarchy', () => {
    it('should handle all heading levels', async () => {
      const editor = createSlateEditor({
        value: [
          { type: 'h1', children: [{ text: 'Heading 1' }] },
          { type: 'h2', children: [{ text: 'Heading 2' }] },
          { type: 'h3', children: [{ text: 'Heading 3' }] },
          { type: 'h4', children: [{ text: 'Heading 4' }] },
          { type: 'h5', children: [{ text: 'Heading 5' }] },
          { type: 'h6', children: [{ text: 'Heading 6' }] },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });

    it('should handle headings with formatting', async () => {
      const editor = createSlateEditor({
        value: [
          {
            type: 'h1',
            children: [
              { text: 'Bold ', bold: true },
              { text: 'Italic ', italic: true },
              { text: 'Normal' },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });
  });

  describe('Performance and Size', () => {
    it('should handle large documents efficiently', async () => {
      const largeValue = Array.from({ length: 1000 }, (_, i) => ({
        type: 'p',
        children: [{ text: `Paragraph ${i + 1}` }],
      }));

      const editor = createSlateEditor({
        value: largeValue,
      });

      const startTime = Date.now();
      const result = await exportEditorToDocx(editor);
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(result.size).toBeGreaterThan(0);
      // Should complete in reasonable time (less than 5 seconds)
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should handle documents with many inline elements', async () => {
      const children = Array.from({ length: 100 }, (_, i) => ({
        text: `Text ${i} `,
        bold: i % 2 === 0,
        italic: i % 3 === 0,
      }));

      const editor = createSlateEditor({
        value: [
          {
            type: 'p',
            children,
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
    });
  });

  describe('Mixed Content', () => {
    it('should handle complex mixed content document', async () => {
      const editor = createSlateEditor({
        value: [
          { type: 'h1', children: [{ text: 'Document Title' }] },
          { type: 'p', children: [{ text: 'Introduction paragraph' }] },
          {
            type: 'ul',
            children: [
              {
                type: 'li',
                children: [{ type: 'lic', children: [{ text: 'List item 1' }] }],
              },
              {
                type: 'li',
                children: [{ type: 'lic', children: [{ text: 'List item 2' }] }],
              },
            ],
          },
          {
            type: 'blockquote',
            children: [{ type: 'p', children: [{ text: 'A quote' }] }],
          },
          {
            type: 'table',
            children: [
              {
                type: 'tr',
                children: [
                  {
                    type: 'th',
                    children: [{ type: 'p', children: [{ text: 'Header' }] }],
                  },
                ],
              },
              {
                type: 'tr',
                children: [
                  {
                    type: 'td',
                    children: [{ type: 'p', children: [{ text: 'Data' }] }],
                  },
                ],
              },
            ],
          },
          {
            type: 'code_block',
            children: [
              { type: 'code_line', children: [{ text: 'console.log("code");' }] },
            ],
          },
        ],
      });

      const result = await exportEditorToDocx(editor);
      expect(result).toBeDefined();
      expect(result.size).toBeGreaterThan(0);
    });
  });
});
