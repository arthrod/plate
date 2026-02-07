/**
 * Tests for CLI converter tools.
 *
 * Tests convertHtmlToDocx, convertDocxToHtml, normalizeHtml, validateFields,
 * and the full HTML -> DOCX -> HTML round-trip pipeline.
 */
import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'bun:test';
import JSZip from 'jszip';
import type { TNode } from 'platejs';

import { convertDocxToHtml } from '../docx-to-html';
import { convertHtmlToDocx } from '../html-to-docx';
import { normalizeHtml, validateFields } from '../shared/validation-utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const readDocxFixture = (filename: string): Buffer => {
  const docxTestDir = path.resolve(
    __dirname,
    '../../../docx/src/lib/__tests__'
  );

  return fs.readFileSync(path.join(docxTestDir, `${filename}.docx`));
};

const readMammothFixture = (filename: string): Buffer => {
  const mammothTestDir = path.resolve(
    __dirname,
    '../../src/lib/mammoth.js/test/test-data'
  );

  return fs.readFileSync(path.join(mammothTestDir, `${filename}.docx`));
};

const toArrayBuffer = (buf: Buffer): ArrayBuffer =>
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

// ---------------------------------------------------------------------------
// validateFields
// ---------------------------------------------------------------------------

describe('validateFields', () => {
  it('should detect missing reply IDs', () => {
    const nodes: TNode[] = [
      {
        type: 'discussion',
        replies: [{ text: 'reply without id' }],
        children: [{ text: '' }],
      } as unknown as TNode,
    ];
    const errors: string[] = [];
    validateFields(nodes, errors);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('Missing reply.id');
  });

  it('should pass when reply IDs are present', () => {
    const nodes: TNode[] = [
      {
        type: 'discussion',
        replies: [{ id: 'r1', text: 'has id' }],
        children: [{ text: '' }],
      } as unknown as TNode,
    ];
    const errors: string[] = [];
    validateFields(nodes, errors);

    expect(errors).toHaveLength(0);
  });

  it('should recurse into children', () => {
    const nodes: TNode[] = [
      {
        type: 'p',
        children: [
          {
            type: 'comment',
            replies: [{ text: 'no id' }],
            children: [{ text: '' }],
          },
        ],
      } as unknown as TNode,
    ];
    const errors: string[] = [];
    validateFields(nodes, errors);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should handle nodes without discussion/comment type', () => {
    const nodes: TNode[] = [
      { type: 'p', children: [{ text: 'plain' }] } as unknown as TNode,
    ];
    const errors: string[] = [];
    validateFields(nodes, errors);

    expect(errors).toHaveLength(0);
  });

  it('should detect multiple missing reply IDs', () => {
    const nodes: TNode[] = [
      {
        type: 'discussion',
        replies: [
          { text: 'no id 1' },
          { id: 'has-id', text: 'has id' },
          { text: 'no id 2' },
        ],
        children: [{ text: '' }],
      } as unknown as TNode,
    ];
    const errors: string[] = [];
    validateFields(nodes, errors);

    expect(errors).toHaveLength(2);
  });

  it('should handle empty node array', () => {
    const errors: string[] = [];
    validateFields([], errors);

    expect(errors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// normalizeHtml
// ---------------------------------------------------------------------------

describe('normalizeHtml', () => {
  it('should collapse whitespace', () => {
    const result = normalizeHtml('<p>  hello   world  </p>');

    expect(result).toBe('<p> hello world </p>');
  });

  it('should trim outer whitespace', () => {
    const result = normalizeHtml('  <p>hi</p>  ');

    expect(result).toBe('<p>hi</p>');
  });

  it('should normalize identical HTML to same string', () => {
    const a = normalizeHtml('<p>Hello</p>');
    const b = normalizeHtml('<p>Hello</p>');

    expect(a).toBe(b);
  });

  it('should handle empty string', () => {
    const result = normalizeHtml('');

    expect(result).toBe('');
  });

  it('should normalize newlines as whitespace', () => {
    const result = normalizeHtml('<p>line1\n\nline2</p>');

    expect(result).toBe('<p>line1 line2</p>');
  });
});

// ---------------------------------------------------------------------------
// convertHtmlToDocx
// ---------------------------------------------------------------------------

describe('convertHtmlToDocx', () => {
  it('should return a Blob', async () => {
    const blob = await convertHtmlToDocx('<p>Test</p>');

    expect(blob).toBeInstanceOf(Blob);
  });

  it('should return blob with correct MIME type', async () => {
    const blob = await convertHtmlToDocx('<p>Test</p>');

    expect(blob.type).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  });

  it('should create a valid DOCX ZIP structure', async () => {
    const blob = await convertHtmlToDocx('<p>Test</p>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());

    expect(zip.file('[Content_Types].xml')).not.toBeNull();
    expect(zip.file('_rels/.rels')).not.toBeNull();
    expect(zip.file('word/document.xml')).not.toBeNull();
    expect(zip.file('word/styles.xml')).not.toBeNull();
  });

  it('should include content in document.xml', async () => {
    const blob = await convertHtmlToDocx('<p>Hello World</p>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('Hello World');
  });

  it('should support landscape orientation', async () => {
    const blob = await convertHtmlToDocx('<p>Test</p>', {
      orientation: 'landscape',
    });
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('w:orient="landscape"');
  });

  it('should handle bold text in DOCX output', async () => {
    const blob = await convertHtmlToDocx('<p><strong>Bold text</strong></p>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('Bold text');
    expect(docXml).toContain('<w:b');
  });

  it('should handle italic text in DOCX output', async () => {
    const blob = await convertHtmlToDocx('<p><em>Italic</em></p>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('Italic');
    expect(docXml).toContain('<w:i');
  });

  it('should handle headings', async () => {
    const blob = await convertHtmlToDocx('<h1>Heading</h1>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('Heading');
  });

  it('should handle tables', async () => {
    const blob = await convertHtmlToDocx(
      '<table><tr><td>Cell</td></tr></table>'
    );
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('Cell');
    expect(docXml).toContain('<w:tbl');
  });

  it('should handle lists', async () => {
    const blob = await convertHtmlToDocx(
      '<ul><li>Item 1</li><li>Item 2</li></ul>'
    );
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('Item 1');
    expect(docXml).toContain('Item 2');
  });

  it('should handle hyperlinks', async () => {
    const blob = await convertHtmlToDocx(
      '<p><a href="https://example.com">Click</a></p>'
    );
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('Click');
    expect(docXml).toContain('<w:hyperlink');
  });

  it('should handle empty HTML', async () => {
    const blob = await convertHtmlToDocx('');

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle code blocks', async () => {
    const blob = await convertHtmlToDocx(
      '<pre><code>const x = 1;</code></pre>'
    );
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('const x = 1;');
  });

  it('should handle blockquotes', async () => {
    const blob = await convertHtmlToDocx('<blockquote>A quote</blockquote>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('A quote');
  });
});

// ---------------------------------------------------------------------------
// convertDocxToHtml
// ---------------------------------------------------------------------------

describe('convertDocxToHtml', () => {
  it('should convert a simple DOCX to HTML', async () => {
    const buffer = readMammothFixture('single-paragraph');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    expect(result.html.length).toBeGreaterThan(0);
    expect(result.html).toContain('<p>');
  });

  it('should convert DOCX with comments', async () => {
    const buffer = readMammothFixture('comments');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    expect(result.html.length).toBeGreaterThan(0);
  });

  it('should return raw HTML when raw=true', async () => {
    const buffer = readMammothFixture('single-paragraph');
    const raw = await convertDocxToHtml(toArrayBuffer(buffer), true);
    const processed = await convertDocxToHtml(toArrayBuffer(buffer), false);

    expect(raw.html.length).toBeGreaterThan(0);
    expect(processed.html.length).toBeGreaterThan(0);
  });

  it('should return warnings array', async () => {
    const buffer = readMammothFixture('single-paragraph');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it('should convert headers DOCX', async () => {
    const buffer = readDocxFixture('headers');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    expect(result.html).toContain('<h');
  });

  it('should convert tables DOCX', async () => {
    const buffer = readDocxFixture('tables');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    expect(result.html).toContain('<table');
  });

  it('should convert block_quotes DOCX', async () => {
    const buffer = readDocxFixture('block_quotes');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    expect(result.html.length).toBeGreaterThan(0);
  });

  it('should convert links DOCX', async () => {
    const buffer = readDocxFixture('links');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    expect(result.html).toContain('<a');
  });

  it('should handle empty DOCX', async () => {
    const buffer = readMammothFixture('empty');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    expect(result.html).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Full pipeline: HTML -> DOCX -> HTML round-trip
// ---------------------------------------------------------------------------

describe('html-docx-html round-trip', () => {
  it('should round-trip a basic paragraph through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx('<p>Hello World</p>');
    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    expect(result.html).toContain('Hello World');
  });

  it('should round-trip bold text through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx(
      '<p><strong>Bold text</strong></p>'
    );
    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    expect(result.html).toContain('Bold text');
  });

  it('should round-trip headings through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx('<h1>Title</h1><p>Body</p>');
    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    expect(result.html).toContain('Title');
    expect(result.html).toContain('Body');
  });

  it('should round-trip tables through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx(
      '<table><tr><td>A</td><td>B</td></tr></table>'
    );
    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    expect(result.html).toContain('A');
    expect(result.html).toContain('B');
  });

  it('should round-trip lists through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx(
      '<ul><li>Item 1</li><li>Item 2</li></ul>'
    );
    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    expect(result.html).toContain('Item 1');
    expect(result.html).toContain('Item 2');
  });

  it('should round-trip links through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx(
      '<p><a href="https://example.com">Link text</a></p>'
    );
    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    expect(result.html).toContain('Link text');
  });

  it('should round-trip complex document through DOCX', async () => {
    const complexHtml = `
      <h1>Document Title</h1>
      <p>A paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <h2>Section 1</h2>
      <ul>
        <li>Item A</li>
        <li>Item B</li>
      </ul>
      <table>
        <tr><td>Cell 1</td><td>Cell 2</td></tr>
      </table>
      <blockquote>A quote</blockquote>
    `;

    const docxBlob = await convertHtmlToDocx(complexHtml);
    expect(docxBlob.size).toBeGreaterThan(0);

    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    expect(result.html).toContain('Document Title');
    expect(result.html).toContain('bold');
    expect(result.html).toContain('italic');
    expect(result.html).toContain('Item A');
    expect(result.html).toContain('Cell 1');
    expect(result.html).toContain('A quote');
  });
});

// ---------------------------------------------------------------------------
// DOCX import -> export round-trip (using fixture files)
// ---------------------------------------------------------------------------

describe('docx import-export round-trip', () => {
  it('should import headers.docx, export to DOCX, and reimport', async () => {
    const buffer = readDocxFixture('headers');
    const { html } = await convertDocxToHtml(toArrayBuffer(buffer));

    const docxBlob = await convertHtmlToDocx(html);
    expect(docxBlob.size).toBeGreaterThan(0);

    const reimported = await convertDocxToHtml(await docxBlob.arrayBuffer());
    expect(reimported.html.length).toBeGreaterThan(0);
  });

  it('should import tables.docx, export, and reimport', async () => {
    const buffer = readDocxFixture('tables');
    const { html } = await convertDocxToHtml(toArrayBuffer(buffer));

    const docxBlob = await convertHtmlToDocx(html);
    const reimported = await convertDocxToHtml(await docxBlob.arrayBuffer());

    expect(reimported.html.length).toBeGreaterThan(0);
  });

  it('should import links.docx, export, and reimport', async () => {
    const buffer = readDocxFixture('links');
    const { html } = await convertDocxToHtml(toArrayBuffer(buffer));

    const docxBlob = await convertHtmlToDocx(html);
    const reimported = await convertDocxToHtml(await docxBlob.arrayBuffer());

    expect(reimported.html.length).toBeGreaterThan(0);
  });
});
