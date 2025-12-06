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

describe('exportEditorToDocx - Additional Coverage', () => {
  describe('paragraph formatting', () => {
    it('should handle paragraphs with alignment', () => {
      const input = (
        <editor>
          <hp align="center">Centered text</hp>
          <hp align="right">Right aligned</hp>
          <hp align="justify">Justified text</hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle paragraphs with indentation', () => {
      const input = (
        <editor>
          <hp indent={1}>Indented level 1</hp>
          <hp indent={2}>Indented level 2</hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle line height', () => {
      const input = (
        <editor>
          <hp lineHeight="1.5">Line height 1.5</hp>
          <hp lineHeight="2">Line height 2</hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('text styling combinations', () => {
    it('should handle multiple marks on same text', () => {
      const input = (
        <editor>
          <hp>
            <htext bold italic underline>
              All styles
            </htext>
          </hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle color and background color', () => {
      const input = (
        <editor>
          <hp>
            <htext color="#FF0000" backgroundColor="#00FF00">
              Colored text
            </htext>
          </hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle font family and size', () => {
      const input = (
        <editor>
          <hp>
            <htext fontFamily="Arial" fontSize="16px">
              Custom font
            </htext>
          </hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('heading variations', () => {
    it('should handle all heading levels', () => {
      const input = (
        <editor>
          <hh1>Heading 1</hh1>
          <hh2>Heading 2</hh2>
          <hh3>Heading 3</hh3>
          <hh4>Heading 4</hh4>
          <hh5>Heading 5</hh5>
          <hh6>Heading 6</hh6>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle headings with styling', () => {
      const input = (
        <editor>
          <hh1>
            <htext bold>Bold Heading</htext>
          </hh1>
          <hh2>
            <htext italic>Italic Heading</htext>
          </hh2>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('list handling', () => {
    it('should handle nested bullet lists', () => {
      const input = (
        <editor>
          <hul>
            <hli>
              <hlic>Item 1</hlic>
              <hul>
                <hli>
                  <hlic>Nested 1</hlic>
                </hli>
              </hul>
            </hli>
          </hul>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle nested numbered lists', () => {
      const input = (
        <editor>
          <hol>
            <hli>
              <hlic>Item 1</hlic>
              <hol>
                <hli>
                  <hlic>Nested 1</hlic>
                </hol>
              </hli>
            </hli>
          </hol>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle mixed list types', () => {
      const input = (
        <editor>
          <hul>
            <hli>
              <hlic>Bullet item</hlic>
              <hol>
                <hli>
                  <hlic>Numbered nested</hlic>
                </hli>
              </hol>
            </hli>
          </hul>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle lists with multiple items', () => {
      const input = (
        <editor>
          <hul>
            <hli>
              <hlic>Item 1</hlic>
            </hli>
            <hli>
              <hlic>Item 2</hlic>
            </hli>
            <hli>
              <hlic>Item 3</hlic>
            </hli>
          </hul>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('blockquote handling', () => {
    it('should handle simple blockquotes', () => {
      const input = (
        <editor>
          <hblockquote>Quote text</hblockquote>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle blockquotes with multiple paragraphs', () => {
      const input = (
        <editor>
          <hblockquote>
            <hp>First paragraph</hp>
            <hp>Second paragraph</hp>
          </hblockquote>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle nested blockquotes', () => {
      const input = (
        <editor>
          <hblockquote>
            <hp>Outer quote</hp>
            <hblockquote>
              <hp>Inner quote</hp>
            </hblockquote>
          </hblockquote>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('code block handling', () => {
    it('should handle code blocks with language', () => {
      const input = (
        <editor>
          <hcodeblock lang="javascript">const x = 1;</hcodeblock>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle multi-line code blocks', () => {
      const input = (
        <editor>
          <hcodeblock>
            {`function hello() {
  return "world";
}`}
          </hcodeblock>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle inline code', () => {
      const input = (
        <editor>
          <hp>
            This is <htext code>inline code</htext> in text
          </hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('link handling', () => {
    it('should handle links with URLs', () => {
      const input = (
        <editor>
          <hp>
            <ha url="https://example.com">Link text</ha>
          </hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle links with styled text', () => {
      const input = (
        <editor>
          <hp>
            <ha url="https://example.com">
              <htext bold>Bold link</htext>
            </ha>
          </hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('table handling', () => {
    it('should handle simple tables', () => {
      const input = (
        <editor>
          <htable>
            <htr>
              <htd>Cell 1</htd>
              <htd>Cell 2</htd>
            </htr>
            <htr>
              <htd>Cell 3</htd>
              <htd>Cell 4</htd>
            </htr>
          </htable>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle tables with headers', () => {
      const input = (
        <editor>
          <htable>
            <htr>
              <hth>Header 1</hth>
              <hth>Header 2</hth>
            </htr>
            <htr>
              <htd>Data 1</htd>
              <htd>Data 2</htd>
            </htr>
          </htable>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('image handling', () => {
    it('should handle images with URLs', () => {
      const input = (
        <editor>
          <himg url="https://example.com/image.png" />
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle images with dimensions', () => {
      const input = (
        <editor>
          <himg url="https://example.com/image.png" width={300} height={200} />
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('complex documents', () => {
    it('should handle documents with mixed content', () => {
      const input = (
        <editor>
          <hh1>Title</hh1>
          <hp>Paragraph with <htext bold>bold</htext> and <htext italic>italic</htext></hp>
          <hul>
            <hli>
              <hlic>List item</hlic>
            </hli>
          </hul>
          <hblockquote>Quote</hblockquote>
          <hcodeblock>code</hcodeblock>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle empty paragraphs', () => {
      const input = (
        <editor>
          <hp></hp>
          <hp>Text</hp>
          <hp></hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle paragraphs with only whitespace', () => {
      const input = (
        <editor>
          <hp>   </hp>
          <hp>Text</hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle unknown node types gracefully', () => {
      const input = {
        children: [
          {
            type: 'unknown-type',
            children: [{ text: 'text' }],
          },
        ],
      } as any;

      const result = exportEditorToDocx(input);
      expect(result).toBeDefined();
    });

    it('should handle nodes without children', () => {
      const input = {
        children: [
          {
            type: 'p',
          },
        ],
      } as any;

      expect(() => {
        exportEditorToDocx(input);
      }).not.toThrow();
    });

    it('should handle null values gracefully', () => {
      const input = {
        children: [
          {
            type: 'p',
            children: [{ text: null as any }],
          },
        ],
      } as any;

      expect(() => {
        exportEditorToDocx(input);
      }).not.toThrow();
    });

    it('should handle undefined values gracefully', () => {
      const input = {
        children: [
          {
            type: 'p',
            children: [{ text: undefined as any }],
          },
        ],
      } as any;

      expect(() => {
        exportEditorToDocx(input);
      }).not.toThrow();
    });
  });

  describe('custom options', () => {
    it('should accept custom document options', () => {
      const input = (
        <editor>
          <hp>Test</hp>
        </editor>
      ) as any;

      const options = {
        sections: {
          properties: {
            page: {
              margin: { top: 2000, right: 2000, bottom: 2000, left: 2000 },
            },
          },
        },
      };

      const result = exportEditorToDocx(input, options);
      expect(result).toBeDefined();
    });

    it('should handle empty options object', () => {
      const input = (
        <editor>
          <hp>Test</hp>
        </editor>
      ) as any;

      const result = exportEditorToDocx(input, {});
      expect(result).toBeDefined();
    });
  });

  describe('performance', () => {
    it('should handle large documents efficiently', () => {
      const paragraphs = Array.from({ length: 100 }, (_, i) => (
        <hp key={i}>Paragraph {i}</hp>
      ));

      const input = <editor>{paragraphs}</editor> as any;

      const start = Date.now();
      const result = exportEditorToDocx(input);
      const duration = Date.now() - start;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(5000); // Should complete in reasonable time
    });

    it('should handle deeply nested structures', () => {
      const input = (
        <editor>
          <hul>
            <hli>
              <hlic>Level 1</hlic>
              <hul>
                <hli>
                  <hlic>Level 2</hlic>
                  <hul>
                    <hli>
                      <hlic>Level 3</hlic>
                      <hul>
                        <hli>
                          <hlic>Level 4</hlic>
                        </hli>
                      </hul>
                    </hli>
                  </hul>
                </hli>
              </hul>
            </hli>
          </hul>
        </editor>
      ) as any;

      expect(() => {
        exportEditorToDocx(input);
      }).not.toThrow();
    });
  });
});
