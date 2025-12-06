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
