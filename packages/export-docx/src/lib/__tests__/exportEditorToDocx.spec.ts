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

describe('exportEditorToDocx - CSS Style Parsing Edge Cases', () => {
  it('should handle RGB color format', async () => {
    const editor = createEditor();
    const html = '<p style="color: rgb(255, 0, 0)">Red text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle hex color format', async () => {
    const editor = createEditor();
    const html = '<p style="color: #00ff00">Green text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle background color highlighting', async () => {
    const editor = createEditor();
    const html = '<p style="background-color: yellow">Highlighted text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle font-size in pixels', async () => {
    const editor = createEditor();
    const html = '<p style="font-size: 16px">Custom font size</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle text-align styles', async () => {
    const editor = createEditor();
    const html = `
      <p style="text-align: left">Left aligned</p>
      <p style="text-align: center">Center aligned</p>
      <p style="text-align: right">Right aligned</p>
      <p style="text-align: justify">Justified text</p>
    `;

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle margin-left for indentation', async () => {
    const editor = createEditor();
    const html = '<p style="margin-left: 40px">Indented paragraph</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle font-weight variations', async () => {
    const editor = createEditor();
    const html = `
      <p style="font-weight: bold">Bold with style</p>
      <p style="font-weight: 700">Bold with numeric</p>
    `;

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle font-style italic', async () => {
    const editor = createEditor();
    const html = '<p style="font-style: italic">Italic text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle text-decoration underline', async () => {
    const editor = createEditor();
    const html = '<p style="text-decoration: underline">Underlined text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle text-decoration line-through', async () => {
    const editor = createEditor();
    const html = '<p style="text-decoration: line-through">Strikethrough text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe('exportEditorToDocx - HTML Tag Support', () => {
  it('should handle all heading levels', async () => {
    const editor = createEditor();
    const html = `
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
    `;

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle B tag for bold', async () => {
    const editor = createEditor();
    const html = '<p>This is <b>bold</b> text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle I tag for italic', async () => {
    const editor = createEditor();
    const html = '<p>This is <i>italic</i> text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle SUB tag for subscript', async () => {
    const editor = createEditor();
    const html = '<p>H<sub>2</sub>O</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle SUP tag for superscript', async () => {
    const editor = createEditor();
    const html = '<p>E=mc<sup>2</sup></p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle DEL tag for strikethrough', async () => {
    const editor = createEditor();
    const html = '<p>This is <del>deleted</del> text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle STRIKE tag for strikethrough', async () => {
    const editor = createEditor();
    const html = '<p>This is <strike>struck through</strike> text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle BR tags for line breaks', async () => {
    const editor = createEditor();
    const html = '<p>Line one<br>Line two<br>Line three</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle BLOCKQUOTE tag', async () => {
    const editor = createEditor();
    const html = '<blockquote>This is a quote</blockquote>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle DIV tags as paragraphs', async () => {
    const editor = createEditor();
    const html = '<div>First div</div><div>Second div</div>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle LI tags', async () => {
    const editor = createEditor();
    const html = '<li>List item content</li>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe('exportEditorToDocx - Complex Formatting Combinations', () => {
  it('should handle deeply nested formatting', async () => {
    const editor = createEditor();
    const html = '<p><strong><em><u>Bold italic underlined</u></em></strong></p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle multiple style attributes', async () => {
    const editor = createEditor();
    const html = '<p style="color: #ff0000; font-size: 18px; text-align: center; background-color: yellow">Multi-styled text</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle mixed HTML tags and inline styles', async () => {
    const editor = createEditor();
    const html = '<p><strong style="color: blue">Bold blue</strong> and <em style="font-size: 14px">italic sized</em></p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle text with all formatting types', async () => {
    const editor = createEditor();
    const html = `
      <p>
        Normal text,
        <strong>bold</strong>,
        <em>italic</em>,
        <u>underline</u>,
        <s>strikethrough</s>,
        <sub>subscript</sub>,
        <sup>superscript</sup>,
        and <strong><em><u>everything combined</u></em></strong>
      </p>
    `;

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe('exportEditorToDocx - Edge Cases and Error Handling', () => {
  it('should handle whitespace-only content', async () => {
    const editor = createEditor();
    const html = '<p>   </p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle very long paragraphs', async () => {
    const editor = createEditor();
    const longText = 'Lorem ipsum dolor sit amet. '.repeat(100);
    const html = `<p>${longText}</p>`;

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle special characters', async () => {
    const editor = createEditor();
    const html = '<p>&lt;Hello&gt; &amp; &quot;World&quot; &apos;Test&apos;</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle unicode characters', async () => {
    const editor = createEditor();
    const html = '<p>Hello 世界 🌍 Привет مرحبا</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle malformed but parseable HTML', async () => {
    const editor = createEditor();
    const html = '<p>Unclosed tag<p>Another paragraph';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle transparent background color', async () => {
    const editor = createEditor();
    const html = '<p style="background-color: transparent">Transparent background</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle inherit background color', async () => {
    const editor = createEditor();
    const html = '<p style="background-color: inherit">Inherited background</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle zero margin-left', async () => {
    const editor = createEditor();
    const html = '<p style="margin-left: 0px">No indent</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle large indentation values', async () => {
    const editor = createEditor();
    const html = '<p style="margin-left: 200px">Heavily indented</p>';

    const blob = await exportEditorToDocx(editor, { html });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe('exportEditorToDocx - Document Configuration', () => {
  it('should handle partial margin configuration', async () => {
    const editor = createEditor();
    const html = '<p>Content</p>';

    const blob = await exportEditorToDocx(editor, {
      html,
      margins: {
        left: 2000,
        right: 2000,
      },
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle partial page size configuration', async () => {
    const editor = createEditor();
    const html = '<p>Content</p>';

    const blob = await exportEditorToDocx(editor, {
      html,
      pageSize: {
        orientation: 'landscape',
      },
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle portrait orientation explicitly', async () => {
    const editor = createEditor();
    const html = '<p>Content</p>';

    const blob = await exportEditorToDocx(editor, {
      html,
      pageSize: {
        orientation: 'portrait',
      },
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle all document properties', async () => {
    const editor = createEditor();
    const html = '<p>Content</p>';

    const blob = await exportEditorToDocx(editor, {
      html,
      properties: {
        creator: 'John Doe',
        description: 'Test document description',
        keywords: 'test, docx, export',
        subject: 'Testing',
        title: 'Complete Document',
      },
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle custom font family', async () => {
    const editor = createEditor();
    const html = '<p>Content</p>';

    const blob = await exportEditorToDocx(editor, {
      fontFamily: 'Courier New',
      html,
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle different font sizes', async () => {
    const editor = createEditor();
    const html = '<p>Content</p>';

    // Test various font sizes (in half-points)
    for (const fontSize of [16, 20, 24, 28, 32]) {
      const blob = await exportEditorToDocx(editor, {
        fontSize,
        html,
      });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    }
  });
});

describe('exportEditorToDocx - Without HTML Option', () => {
  it('should serialize editor content when html option is not provided', async () => {
    const editor = createSlateEditor({
      plugins: [ExportDocxPlugin],
      value: [
        {
          children: [{ text: 'Hello World' }],
          type: 'p',
        },
      ],
    });

    const blob = await exportEditorToDocx(editor);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle complex editor content without html option', async () => {
    const editor = createSlateEditor({
      plugins: [ExportDocxPlugin],
      value: [
        {
          children: [{ text: 'Title' }],
          type: 'h1',
        },
        {
          children: [
            { text: 'This is ' },
            { bold: true, text: 'bold' },
            { text: ' and ' },
            { italic: true, text: 'italic' },
            { text: ' text.' },
          ],
          type: 'p',
        },
      ],
    });

    const blob = await exportEditorToDocx(editor);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe('ExportDocxPlugin - API Integration', () => {
  it('should call downloadDocx with correct parameters', async () => {
    const editor = createEditor();

    // Mock URL.createObjectURL and related APIs
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    const mockUrl = 'blob:mock-url';

    URL.createObjectURL = mock(() => mockUrl);
    URL.revokeObjectURL = mock();

    // Mock document.createElement and click
    const mockClick = mock();
    const mockRemove = mock();
    const mockLink = {
      click: mockClick,
      download: '',
      href: '',
      remove: mockRemove,
    };

    const originalCreateElement = document.createElement.bind(document);
    document.createElement = mock((tag: string) => {
      if (tag === 'a') return mockLink as any;
      return originalCreateElement(tag);
    });

    await editor.api.downloadDocx({ html: '<p>Test</p>' }, 'test.docx');

    expect(mockClick).toHaveBeenCalled();
    expect(mockLink.download).toBe('test.docx');
    expect(mockLink.href).toBe(mockUrl);
    expect(mockRemove).toHaveBeenCalled();

    // Restore
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    document.createElement = originalCreateElement;
  });

  it('should use default filename when not provided', async () => {
    const editor = createEditor();

    const mockClick = mock();
    const mockRemove = mock();
    const mockLink = {
      click: mockClick,
      download: '',
      href: '',
      remove: mockRemove,
    };

    const originalCreateElement = document.createElement.bind(document);
    document.createElement = mock((tag: string) => {
      if (tag === 'a') return mockLink as any;
      return originalCreateElement(tag);
    });

    await editor.api.downloadDocx({ html: '<p>Test</p>' });

    expect(mockLink.download).toBe('document.docx');

    // Restore
    document.createElement = originalCreateElement;
  });

  it('should merge default options from plugin configuration', async () => {
    const editor = createSlateEditor({
      plugins: [
        ExportDocxPlugin.configure({
          options: {
            defaultOptions: {
              fontFamily: 'Times New Roman',
              fontSize: 20,
              properties: {
                creator: 'Test System',
                title: 'Default Title',
              },
            },
          },
        }),
      ],
      value: [{ children: [{ text: 'Test' }], type: 'p' }],
    });

    const blob = await editor.api.exportDocx({ html: '<p>Test</p>' });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should override default options with provided options', async () => {
    const editor = createSlateEditor({
      plugins: [
        ExportDocxPlugin.configure({
          options: {
            defaultOptions: {
              fontSize: 20,
              properties: {
                creator: 'Default Author',
              },
            },
          },
        }),
      ],
      value: [{ children: [{ text: 'Test' }], type: 'p' }],
    });

    const blob = await editor.api.exportDocx({
      fontSize: 28,
      html: '<p>Test</p>',
      properties: {
        creator: 'Override Author',
        title: 'Override Title',
      },
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});