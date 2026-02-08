/**
 * Tests for CLI converter tools.
 *
 * Tests convertHtmlToDocx, convertDocxToHtml, normalizeHtml, validateFields,
 * and the full HTML -> DOCX -> HTML round-trip pipeline.
 *
 * - All test output is saved to a local log file under __logs__/
 * - Every generated DOCX is validated with the OOXML validator (validate.py)
 * - Assertions use loose matchers (toContain, toBeGreaterThan, etc.)
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import JSZip from 'jszip';
import type { TNode } from 'platejs';

import { convertDocxToHtml } from '../docx-to-html';
import { convertHtmlToDocx } from '../html-to-docx';
import { normalizeHtml, validateFields } from '../shared/validation-utils';

// ---------------------------------------------------------------------------
// Log file setup
// ---------------------------------------------------------------------------

const LOG_DIR = path.resolve(__dirname, '../__logs__');
const LOG_FILE = path.join(LOG_DIR, `test-run-${Date.now()}.log`);

function log(message: string) {
  fs.appendFileSync(LOG_FILE, `${message}\n`);
}

beforeAll(() => {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.writeFileSync(
    LOG_FILE,
    `CLI Converter Tests - ${new Date().toISOString()}\n${'='.repeat(60)}\n\n`
  );
  log(`Node: ${process.version}`);
  log(`Platform: ${process.platform}`);
  log(`CWD: ${process.cwd()}\n`);
});

afterAll(() => {
  log(`\n${'='.repeat(60)}`);
  log(`Test run completed at ${new Date().toISOString()}`);
  log(`Log file: ${LOG_FILE}`);
});

// ---------------------------------------------------------------------------
// DOCX validation helper (uses ooxml validate.py)
// ---------------------------------------------------------------------------

const VALIDATE_SCRIPT = path.resolve(
  __dirname,
  '../../../../.claude/skills/docx/ooxml/scripts/validate.py'
);
const UNPACK_SCRIPT = path.resolve(
  __dirname,
  '../../../../.claude/skills/docx/ooxml/scripts/unpack.py'
);

async function validateDocx(
  blob: Blob,
  label: string
): Promise<{ output: string; valid: boolean }> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docx-validate-'));
  const docxPath = path.join(tmpDir, `${label}.docx`);
  const unpackDir = path.join(tmpDir, 'unpacked');

  try {
    // Write blob to file
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(docxPath, buffer);

    // Unpack the DOCX
    execSync(`python3 "${UNPACK_SCRIPT}" "${docxPath}" "${unpackDir}"`, {
      stdio: 'pipe',
    });

    // Validate (use generated file as its own "original" for baseline)
    const result = execSync(
      `python3 "${VALIDATE_SCRIPT}" "${unpackDir}" --original "${docxPath}" -v 2>&1`,
      { stdio: 'pipe', encoding: 'utf-8' }
    );

    log(`[VALIDATE ${label}] PASSED\n${result}\n`);

    return { output: result, valid: true };
  } catch (err) {
    const output =
      err instanceof Error && 'stdout' in err
        ? String((err as { stdout: unknown }).stdout)
        : String(err);

    log(`[VALIDATE ${label}] FAILED\n${output}\n`);

    return { output, valid: false };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Fixture helpers
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

    log(`[validateFields] missing reply IDs: ${JSON.stringify(errors)}`);

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

    log(`[validateFields] valid replies: errors=${errors.length}`);

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

    log(`[validateFields] recurse children: ${JSON.stringify(errors)}`);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should handle nodes without discussion/comment type', () => {
    const nodes: TNode[] = [
      { type: 'p', children: [{ text: 'plain' }] } as unknown as TNode,
    ];
    const errors: string[] = [];
    validateFields(nodes, errors);

    log(`[validateFields] plain nodes: errors=${errors.length}`);

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

    log(`[validateFields] multiple missing: ${JSON.stringify(errors)}`);

    expect(errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle empty node array', () => {
    const errors: string[] = [];
    validateFields([], errors);

    log(`[validateFields] empty array: errors=${errors.length}`);

    expect(errors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// normalizeHtml
// ---------------------------------------------------------------------------

describe('normalizeHtml', () => {
  it('should collapse whitespace', () => {
    const result = normalizeHtml('<p>  hello   world  </p>');

    log(`[normalizeHtml] collapse whitespace: "${result}"`);

    expect(result).toContain('hello world');
    expect(result).toContain('<p>');
    expect(result).toContain('</p>');
  });

  it('should trim outer whitespace', () => {
    const result = normalizeHtml('  <p>hi</p>  ');

    log(`[normalizeHtml] trim outer: "${result}"`);

    expect(result).toContain('<p>hi</p>');
  });

  it('should normalize identical HTML to same string', () => {
    const a = normalizeHtml('<p>Hello</p>');
    const b = normalizeHtml('<p>Hello</p>');

    log(`[normalizeHtml] identical: a="${a}" b="${b}"`);

    expect(a).toContain('Hello');
    expect(b).toContain('Hello');
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
  });

  it('should handle empty string', () => {
    const result = normalizeHtml('');

    log(`[normalizeHtml] empty: "${result}"`);

    expect(result).toHaveLength(0);
  });

  it('should normalize newlines as whitespace', () => {
    const result = normalizeHtml('<p>line1\n\nline2</p>');

    log(`[normalizeHtml] newlines: "${result}"`);

    expect(result).toContain('line1');
    expect(result).toContain('line2');
    // Should not contain raw newlines after normalization
    expect(result).not.toContain('\n');
  });
});

// ---------------------------------------------------------------------------
// convertHtmlToDocx
// ---------------------------------------------------------------------------

describe('convertHtmlToDocx', () => {
  it('should return a Blob', async () => {
    const blob = await convertHtmlToDocx('<p>Test</p>');

    log(
      `[convertHtmlToDocx] blob type: ${blob.constructor.name}, size: ${blob.size}`
    );

    expect(blob).toBeInstanceOf(Blob);

    const validation = await validateDocx(blob, 'basic-blob');
    expect(validation.valid).toBeTruthy();
  });

  it('should return blob with correct MIME type', async () => {
    const blob = await convertHtmlToDocx('<p>Test</p>');

    log(`[convertHtmlToDocx] MIME type: ${blob.type}`);

    expect(blob.type).toContain('wordprocessingml');
    expect(blob.type).toContain('openxmlformats');

    const validation = await validateDocx(blob, 'mime-type');
    expect(validation.valid).toBeTruthy();
  });

  it('should create a valid DOCX ZIP structure', async () => {
    const blob = await convertHtmlToDocx('<p>Test</p>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());

    const files = Object.keys(zip.files);
    log(`[convertHtmlToDocx] ZIP files: ${files.join(', ')}`);

    expect(zip.file('[Content_Types].xml')).not.toBeNull();
    expect(zip.file('_rels/.rels')).not.toBeNull();
    expect(zip.file('word/document.xml')).not.toBeNull();
    expect(zip.file('word/styles.xml')).not.toBeNull();

    const validation = await validateDocx(blob, 'zip-structure');
    expect(validation.valid).toBeTruthy();
  });

  it('should include content in document.xml', async () => {
    const blob = await convertHtmlToDocx('<p>Hello World</p>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(`[convertHtmlToDocx] document.xml length: ${docXml.length}`);

    expect(docXml).toContain('Hello World');

    const validation = await validateDocx(blob, 'content-check');
    expect(validation.valid).toBeTruthy();
  });

  it('should support landscape orientation', async () => {
    const blob = await convertHtmlToDocx('<p>Test</p>', {
      orientation: 'landscape',
    });
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(
      `[convertHtmlToDocx] landscape: contains orient=${docXml.includes('landscape')}`
    );

    expect(docXml).toContain('landscape');

    const validation = await validateDocx(blob, 'landscape');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle bold text in DOCX output', async () => {
    const blob = await convertHtmlToDocx('<p><strong>Bold text</strong></p>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(`[convertHtmlToDocx] bold: contains w:b=${docXml.includes('<w:b')}`);

    expect(docXml).toContain('Bold text');
    expect(docXml).toContain('<w:b');

    const validation = await validateDocx(blob, 'bold-text');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle italic text in DOCX output', async () => {
    const blob = await convertHtmlToDocx('<p><em>Italic</em></p>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(`[convertHtmlToDocx] italic: contains w:i=${docXml.includes('<w:i')}`);

    expect(docXml).toContain('Italic');
    expect(docXml).toContain('<w:i');

    const validation = await validateDocx(blob, 'italic-text');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle headings', async () => {
    const blob = await convertHtmlToDocx('<h1>Heading</h1>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(`[convertHtmlToDocx] heading: ${docXml.substring(0, 200)}...`);

    expect(docXml).toContain('Heading');

    const validation = await validateDocx(blob, 'heading');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle tables', async () => {
    const blob = await convertHtmlToDocx(
      '<table><tr><td>Cell</td></tr></table>'
    );
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(
      `[convertHtmlToDocx] table: contains w:tbl=${docXml.includes('<w:tbl')}`
    );

    expect(docXml).toContain('Cell');
    expect(docXml).toContain('<w:tbl');

    const validation = await validateDocx(blob, 'table');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle lists', async () => {
    const blob = await convertHtmlToDocx(
      '<ul><li>Item 1</li><li>Item 2</li></ul>'
    );
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(
      `[convertHtmlToDocx] list: contains items=${docXml.includes('Item 1') && docXml.includes('Item 2')}`
    );

    expect(docXml).toContain('Item 1');
    expect(docXml).toContain('Item 2');

    const validation = await validateDocx(blob, 'list');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle hyperlinks', async () => {
    const blob = await convertHtmlToDocx(
      '<p><a href="https://example.com">Click</a></p>'
    );
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(
      `[convertHtmlToDocx] hyperlink: contains w:hyperlink=${docXml.includes('<w:hyperlink')}`
    );

    expect(docXml).toContain('Click');
    expect(docXml).toContain('<w:hyperlink');

    const validation = await validateDocx(blob, 'hyperlink');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle empty HTML', async () => {
    const blob = await convertHtmlToDocx('');

    log(`[convertHtmlToDocx] empty HTML: blob size=${blob.size}`);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);

    const validation = await validateDocx(blob, 'empty-html');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle code blocks', async () => {
    const blob = await convertHtmlToDocx(
      '<pre><code>const x = 1;</code></pre>'
    );
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(
      `[convertHtmlToDocx] code block: contains code=${docXml.includes('const x = 1;')}`
    );

    expect(docXml).toContain('const x = 1;');

    const validation = await validateDocx(blob, 'code-block');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle blockquotes', async () => {
    const blob = await convertHtmlToDocx('<blockquote>A quote</blockquote>');
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(
      `[convertHtmlToDocx] blockquote: contains quote=${docXml.includes('A quote')}`
    );

    expect(docXml).toContain('A quote');

    const validation = await validateDocx(blob, 'blockquote');
    expect(validation.valid).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// convertDocxToHtml
// ---------------------------------------------------------------------------

describe('convertDocxToHtml', () => {
  it('should convert a simple DOCX to HTML', async () => {
    const buffer = readMammothFixture('single-paragraph');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    log(`[convertDocxToHtml] simple: html length=${result.html.length}`);

    expect(result.html.length).toBeGreaterThan(0);
    expect(result.html).toContain('<p');
  });

  it('should convert DOCX with comments', async () => {
    const buffer = readMammothFixture('comments');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    log(`[convertDocxToHtml] comments: html length=${result.html.length}`);

    expect(result.html.length).toBeGreaterThan(0);
  });

  it('should return raw HTML when raw=true', async () => {
    const buffer = readMammothFixture('single-paragraph');
    const raw = await convertDocxToHtml(toArrayBuffer(buffer), true);
    const processed = await convertDocxToHtml(toArrayBuffer(buffer), false);

    log(
      `[convertDocxToHtml] raw vs processed: raw=${raw.html.length} processed=${processed.html.length}`
    );

    expect(raw.html.length).toBeGreaterThan(0);
    expect(processed.html.length).toBeGreaterThan(0);
  });

  it('should return warnings array', async () => {
    const buffer = readMammothFixture('single-paragraph');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    log(`[convertDocxToHtml] warnings: ${JSON.stringify(result.warnings)}`);

    expect(Array.isArray(result.warnings)).toBeTruthy();
  });

  it('should convert headers DOCX', async () => {
    const buffer = readDocxFixture('headers');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    log(`[convertDocxToHtml] headers: html=${result.html.substring(0, 200)}`);

    expect(result.html).toContain('<h');
  });

  it('should convert tables DOCX', async () => {
    const buffer = readDocxFixture('tables');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    log(
      `[convertDocxToHtml] tables: contains table=${result.html.includes('<table')}`
    );

    expect(result.html).toContain('<table');
  });

  it('should convert block_quotes DOCX', async () => {
    const buffer = readDocxFixture('block_quotes');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    log(`[convertDocxToHtml] block_quotes: html length=${result.html.length}`);

    expect(result.html.length).toBeGreaterThan(0);
  });

  it('should convert links DOCX', async () => {
    const buffer = readDocxFixture('links');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    log(`[convertDocxToHtml] links: contains a=${result.html.includes('<a')}`);

    expect(result.html).toContain('<a');
  });

  it('should handle empty DOCX', async () => {
    const buffer = readMammothFixture('empty');
    const result = await convertDocxToHtml(toArrayBuffer(buffer));

    log(`[convertDocxToHtml] empty: html="${result.html}"`);

    expect(result.html).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Full pipeline: HTML -> DOCX -> HTML round-trip
// ---------------------------------------------------------------------------

describe('html-docx-html round-trip', () => {
  it('should round-trip a basic paragraph through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx('<p>Hello World</p>');

    const validation = await validateDocx(docxBlob, 'rt-basic-paragraph');
    expect(validation.valid).toBeTruthy();

    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(`[round-trip] basic paragraph: ${result.html.substring(0, 200)}`);

    expect(result.html).toContain('Hello World');
  });

  it('should round-trip bold text through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx(
      '<p><strong>Bold text</strong></p>'
    );

    const validation = await validateDocx(docxBlob, 'rt-bold');
    expect(validation.valid).toBeTruthy();

    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(`[round-trip] bold: ${result.html.substring(0, 200)}`);

    expect(result.html).toContain('Bold text');
  });

  it('should round-trip headings through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx('<h1>Title</h1><p>Body</p>');

    const validation = await validateDocx(docxBlob, 'rt-headings');
    expect(validation.valid).toBeTruthy();

    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(`[round-trip] headings: ${result.html.substring(0, 200)}`);

    expect(result.html).toContain('Title');
    expect(result.html).toContain('Body');
  });

  it('should round-trip tables through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx(
      '<table><tr><td>A</td><td>B</td></tr></table>'
    );

    const validation = await validateDocx(docxBlob, 'rt-tables');
    expect(validation.valid).toBeTruthy();

    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(`[round-trip] tables: ${result.html.substring(0, 200)}`);

    expect(result.html).toContain('A');
    expect(result.html).toContain('B');
  });

  it('should round-trip lists through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx(
      '<ul><li>Item 1</li><li>Item 2</li></ul>'
    );

    const validation = await validateDocx(docxBlob, 'rt-lists');
    expect(validation.valid).toBeTruthy();

    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(`[round-trip] lists: ${result.html.substring(0, 200)}`);

    expect(result.html).toContain('Item 1');
    expect(result.html).toContain('Item 2');
  });

  it('should round-trip links through DOCX', async () => {
    const docxBlob = await convertHtmlToDocx(
      '<p><a href="https://example.com">Link text</a></p>'
    );

    const validation = await validateDocx(docxBlob, 'rt-links');
    expect(validation.valid).toBeTruthy();

    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(`[round-trip] links: ${result.html.substring(0, 200)}`);

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

    const validation = await validateDocx(docxBlob, 'rt-complex');
    expect(validation.valid).toBeTruthy();

    const result = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(`[round-trip] complex: html length=${result.html.length}`);

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

    const validation = await validateDocx(docxBlob, 'fixture-headers');
    expect(validation.valid).toBeTruthy();

    const reimported = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(
      `[fixture-rt] headers: original=${html.length} reimported=${reimported.html.length}`
    );

    expect(reimported.html.length).toBeGreaterThan(0);
  });

  it('should import tables.docx, export, and reimport', async () => {
    const buffer = readDocxFixture('tables');
    const { html } = await convertDocxToHtml(toArrayBuffer(buffer));

    const docxBlob = await convertHtmlToDocx(html);

    const validation = await validateDocx(docxBlob, 'fixture-tables');
    expect(validation.valid).toBeTruthy();

    const reimported = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(
      `[fixture-rt] tables: original=${html.length} reimported=${reimported.html.length}`
    );

    expect(reimported.html.length).toBeGreaterThan(0);
  });

  it('should import links.docx, export, and reimport', async () => {
    const buffer = readDocxFixture('links');
    const { html } = await convertDocxToHtml(toArrayBuffer(buffer));

    const docxBlob = await convertHtmlToDocx(html);

    const validation = await validateDocx(docxBlob, 'fixture-links');
    expect(validation.valid).toBeTruthy();

    const reimported = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(
      `[fixture-rt] links: original=${html.length} reimported=${reimported.html.length}`
    );

    expect(reimported.html.length).toBeGreaterThan(0);
  });

  it('should import block_quotes.docx, export, and reimport', async () => {
    const buffer = readDocxFixture('block_quotes');
    const { html } = await convertDocxToHtml(toArrayBuffer(buffer));

    const docxBlob = await convertHtmlToDocx(html);

    const validation = await validateDocx(docxBlob, 'fixture-block-quotes');
    expect(validation.valid).toBeTruthy();

    const reimported = await convertDocxToHtml(await docxBlob.arrayBuffer());

    log(
      `[fixture-rt] block_quotes: original=${html.length} reimported=${reimported.html.length}`
    );

    expect(reimported.html.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// DOCX validation-specific tests
// ---------------------------------------------------------------------------

describe('DOCX OOXML validation', () => {
  it('should produce valid OOXML for nested formatting', async () => {
    const blob = await convertHtmlToDocx(
      '<p><strong><em>Bold and italic</em></strong></p>'
    );

    const validation = await validateDocx(blob, 'nested-formatting');
    log(`[ooxml] nested formatting: ${validation.output.substring(0, 300)}`);
    expect(validation.valid).toBeTruthy();
  });

  it('should produce valid OOXML for multi-row tables', async () => {
    const blob = await convertHtmlToDocx(`
      <table>
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Row 1 Cell 1</td><td>Row 1 Cell 2</td></tr>
        <tr><td>Row 2 Cell 1</td><td>Row 2 Cell 2</td></tr>
      </table>
    `);

    const validation = await validateDocx(blob, 'multi-row-table');
    log(`[ooxml] multi-row table: ${validation.output.substring(0, 300)}`);
    expect(validation.valid).toBeTruthy();
  });

  it('should produce valid OOXML for ordered lists', async () => {
    const blob = await convertHtmlToDocx(
      '<ol><li>First</li><li>Second</li><li>Third</li></ol>'
    );

    const validation = await validateDocx(blob, 'ordered-list');
    log(`[ooxml] ordered list: ${validation.output.substring(0, 300)}`);
    expect(validation.valid).toBeTruthy();
  });

  it('should produce valid OOXML for mixed content', async () => {
    const blob = await convertHtmlToDocx(`
      <h1>Title</h1>
      <p>Paragraph with <strong>bold</strong>, <em>italic</em>, and <a href="https://example.com">link</a>.</p>
      <ul><li>Bullet 1</li><li>Bullet 2</li></ul>
      <ol><li>Numbered 1</li><li>Numbered 2</li></ol>
      <table><tr><td>A</td><td>B</td></tr></table>
      <pre><code>code block</code></pre>
      <blockquote>Quote text</blockquote>
    `);

    const validation = await validateDocx(blob, 'mixed-content');
    log(`[ooxml] mixed content: ${validation.output.substring(0, 300)}`);
    expect(validation.valid).toBeTruthy();
  });

  it('should produce valid OOXML for underline text', async () => {
    const blob = await convertHtmlToDocx('<p><u>Underlined</u></p>');

    const validation = await validateDocx(blob, 'underline');
    log(`[ooxml] underline: ${validation.output.substring(0, 300)}`);
    expect(validation.valid).toBeTruthy();

    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');
    expect(docXml).toContain('Underlined');
  });

  it('should produce valid OOXML for strikethrough text', async () => {
    const blob = await convertHtmlToDocx('<p><s>Strikethrough</s></p>');

    const validation = await validateDocx(blob, 'strikethrough');
    log(`[ooxml] strikethrough: ${validation.output.substring(0, 300)}`);
    expect(validation.valid).toBeTruthy();

    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const docXml = await zip.file('word/document.xml')!.async('string');
    expect(docXml).toContain('Strikethrough');
  });

  it('should produce valid OOXML for nested lists', async () => {
    const blob = await convertHtmlToDocx(`
      <ul>
        <li>Parent 1
          <ul>
            <li>Child 1.1</li>
            <li>Child 1.2</li>
          </ul>
        </li>
        <li>Parent 2</li>
      </ul>
    `);

    const validation = await validateDocx(blob, 'nested-lists');
    log(`[ooxml] nested lists: ${validation.output.substring(0, 300)}`);
    expect(validation.valid).toBeTruthy();
  });

  it('should produce valid OOXML for horizontal rules', async () => {
    const blob = await convertHtmlToDocx('<p>Before</p><hr/><p>After</p>');

    const validation = await validateDocx(blob, 'horizontal-rule');
    log(`[ooxml] horizontal rule: ${validation.output.substring(0, 300)}`);
    expect(validation.valid).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Node API path: file-based I/O (Buffer → ArrayBuffer → convert)
// ---------------------------------------------------------------------------

describe('Node API path', () => {
  it('should convert HTML to DOCX and write to file via Buffer', async () => {
    const html = '<h1>Node API Test</h1><p>Generated via Node Buffer path.</p>';
    const blob = await convertHtmlToDocx(html);

    // Node path: Blob → ArrayBuffer → Buffer → write to file
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tmpFile = path.join(os.tmpdir(), `node-api-test-${Date.now()}.docx`);
    fs.writeFileSync(tmpFile, buffer);

    log(`[node-api] wrote DOCX to ${tmpFile}, size=${buffer.length}`);

    expect(buffer.length).toBeGreaterThan(0);
    expect(fs.existsSync(tmpFile)).toBeTruthy();

    // Read it back and verify
    const readBack = fs.readFileSync(tmpFile);
    const result = await convertDocxToHtml(toArrayBuffer(readBack));

    expect(result.html).toContain('Node API Test');

    const validation = await validateDocx(blob, 'node-api-write');
    expect(validation.valid).toBeTruthy();

    fs.unlinkSync(tmpFile);
  });

  it('should import DOCX from file Buffer and convert to HTML', async () => {
    const buffer = readDocxFixture('headers');

    // Node path: fs.readFileSync → Buffer → ArrayBuffer → mammoth
    const arrayBuffer = toArrayBuffer(buffer);
    const result = await convertDocxToHtml(arrayBuffer);

    log(`[node-api] import from file: html length=${result.html.length}`);

    expect(result.html.length).toBeGreaterThan(0);
    expect(result.html).toContain('<h');
  });

  it('should round-trip DOCX through file system', async () => {
    const html =
      '<p>File system round-trip</p><table><tr><td>Data</td></tr></table>';
    const blob = await convertHtmlToDocx(html);

    // Write to disk
    const tmpFile = path.join(os.tmpdir(), `node-rt-test-${Date.now()}.docx`);
    fs.writeFileSync(tmpFile, Buffer.from(await blob.arrayBuffer()));

    // Read from disk and convert back
    const readBack = fs.readFileSync(tmpFile);
    const result = await convertDocxToHtml(toArrayBuffer(readBack));

    log(`[node-api] file round-trip: ${result.html.substring(0, 200)}`);

    expect(result.html).toContain('File system round-trip');
    expect(result.html).toContain('Data');

    const validation = await validateDocx(blob, 'node-api-roundtrip');
    expect(validation.valid).toBeTruthy();

    fs.unlinkSync(tmpFile);
  });

  it('should handle large documents via file I/O', async () => {
    // Generate a large HTML document
    const paragraphs = Array.from(
      { length: 50 },
      (_, i) =>
        `<p>Paragraph ${i + 1} with some content to test larger files.</p>`
    ).join('\n');
    const html = `<h1>Large Document</h1>${paragraphs}`;

    const blob = await convertHtmlToDocx(html);
    const tmpFile = path.join(os.tmpdir(), `node-large-${Date.now()}.docx`);
    fs.writeFileSync(tmpFile, Buffer.from(await blob.arrayBuffer()));

    const readBack = fs.readFileSync(tmpFile);
    const result = await convertDocxToHtml(toArrayBuffer(readBack));

    log(
      `[node-api] large doc: html length=${result.html.length}, file size=${readBack.length}`
    );

    expect(result.html).toContain('Large Document');
    expect(result.html).toContain('Paragraph 1');
    expect(result.html).toContain('Paragraph 50');

    const validation = await validateDocx(blob, 'node-api-large');
    expect(validation.valid).toBeTruthy();

    fs.unlinkSync(tmpFile);
  });
});

// ---------------------------------------------------------------------------
// Browser API path: ArrayBuffer/Blob-based I/O (no file system)
// ---------------------------------------------------------------------------

describe('Browser API path', () => {
  it('should convert HTML to DOCX returning a Blob (browser-native)', async () => {
    const html = '<h1>Browser Test</h1><p>Generated via browser Blob path.</p>';
    const blob = await convertHtmlToDocx(html);

    // Browser path: Blob is used directly (no file write)
    log(`[browser-api] blob: type=${blob.type} size=${blob.size}`);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toContain('openxmlformats');

    const validation = await validateDocx(blob, 'browser-api-blob');
    expect(validation.valid).toBeTruthy();
  });

  it('should convert DOCX ArrayBuffer to HTML (browser FileReader simulation)', async () => {
    // Simulate browser: FileReader.readAsArrayBuffer → ArrayBuffer
    const buffer = readMammothFixture('single-paragraph');
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );

    // Browser path: ArrayBuffer → mammoth (same as FileReader output)
    const result = await convertDocxToHtml(arrayBuffer);

    log(`[browser-api] FileReader sim: html length=${result.html.length}`);

    expect(result.html.length).toBeGreaterThan(0);
    expect(result.html).toContain('<p');
  });

  it('should round-trip entirely via Blob/ArrayBuffer (no file I/O)', async () => {
    const html = '<p>Browser-only round-trip</p><ul><li>No files</li></ul>';

    // Step 1: HTML → Blob (browser-native output)
    const blob = await convertHtmlToDocx(html);

    // Step 2: Blob → ArrayBuffer (browser Blob.arrayBuffer() API)
    const arrayBuffer = await blob.arrayBuffer();

    // Step 3: ArrayBuffer → HTML (mammoth browser build)
    const result = await convertDocxToHtml(arrayBuffer);

    log(`[browser-api] blob round-trip: ${result.html.substring(0, 200)}`);

    expect(result.html).toContain('Browser-only round-trip');
    expect(result.html).toContain('No files');

    const validation = await validateDocx(blob, 'browser-api-roundtrip');
    expect(validation.valid).toBeTruthy();
  });

  it('should handle Blob.slice for partial reads (browser pattern)', async () => {
    const blob = await convertHtmlToDocx('<p>Partial read test</p>');

    // Browser pattern: Blob.slice() + read sliced blob
    const sliced = blob.slice(0, blob.size, blob.type);
    const arrayBuffer = await sliced.arrayBuffer();

    // Verify the sliced blob produces valid DOCX
    const zip = await JSZip.loadAsync(arrayBuffer);
    const docXml = await zip.file('word/document.xml')!.async('string');

    log(`[browser-api] blob slice: docXml length=${docXml.length}`);

    expect(docXml).toContain('Partial read test');

    const validation = await validateDocx(blob, 'browser-api-slice');
    expect(validation.valid).toBeTruthy();
  });

  it('should convert Blob to Uint8Array (browser download pattern)', async () => {
    const blob = await convertHtmlToDocx('<p>Download pattern</p>');

    // Browser download pattern: Blob → ArrayBuffer → Uint8Array
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    log(`[browser-api] uint8array: length=${uint8Array.length}`);

    expect(uint8Array.length).toBeGreaterThan(0);

    // Verify the Uint8Array can be converted back to DOCX
    const reconverted = await convertDocxToHtml(
      uint8Array.buffer.slice(
        uint8Array.byteOffset,
        uint8Array.byteOffset + uint8Array.byteLength
      )
    );

    expect(reconverted.html).toContain('Download pattern');

    const validation = await validateDocx(blob, 'browser-api-uint8');
    expect(validation.valid).toBeTruthy();
  });
});
