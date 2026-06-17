import { cleanDocx } from '../cleanDocx';

const RTF = '{\\rtf1}';

const insStart = (id: string, author = 'John Doe') =>
  `[[DOCX_INS_START:{"id":"${id}","author":"${author}","date":"2026-01-01T00:00:00Z"}]]`;
const insEnd = (id: string) => `[[DOCX_INS_END:${id}]]`;
const delStart = (id: string, author = 'Jane') =>
  `[[DOCX_DEL_START:{"id":"${id}","author":"${author}","date":"2026-01-02T00:00:00Z"}]]`;
const delEnd = (id: string) => `[[DOCX_DEL_END:${id}]]`;
const cmtStart = (id: string, body: string) =>
  `[[DOCX_CMT_START:{"id":"${id}","authorName":"O'Brien","body":"${body}"}]]`;
const cmtEnd = (id: string) => `[[DOCX_CMT_END:${id}]]`;

describe('cleanDocx tracking-token round-trip (variant B — per-cleaner skip predicates)', () => {
  it('preserves a paragraph whose only content is a closing token (end-only)', () => {
    const html = `<p>${insEnd('a')}</p>`;
    const result = cleanDocx(html, RTF);
    expect(result).toContain(insEnd('a'));
  });

  it('preserves an insertion token pair around inline text', () => {
    const html = `<p>before ${insStart('a')}new${insEnd('a')} after</p>`;
    const result = cleanDocx(html, RTF);
    expect(result).toContain(insStart('a'));
    expect(result).toContain(insEnd('a'));
  });

  it('preserves adjacent tokens without merging', () => {
    const html = `<p>x ${insEnd('a')}${delStart('b')}y${delEnd('b')} z</p>`;
    const result = cleanDocx(html, RTF);
    expect(result).toContain(insEnd('a'));
    expect(result).toContain(delStart('b'));
    expect(result).toContain(delEnd('b'));
  });

  it('keeps a token through cleanDocxSpans on a mso-styled span', () => {
    const html = `<p><span style="mso-list:ignore">${insStart('a')}new${insEnd('a')}</span></p>`;
    const result = cleanDocx(html, RTF);
    expect(result).toContain(insStart('a'));
    expect(result).toContain(insEnd('a'));
  });

  it('keeps JSON payloads with escaped quotes intact', () => {
    const html = `<p>${cmtStart('c1', 'He said \\"hi\\"')}body${cmtEnd('c1')}</p>`;
    const result = cleanDocx(html, RTF);
    expect(result).toContain(`"id":"c1"`);
    expect(result).toContain(`He said \\"hi\\"`);
  });

  it('does not match a user-typed bracket pair like `[[note]]`', () => {
    const html = `<p>see [[note]]</p>`;
    const result = cleanDocx(html, RTF);
    expect(result).toContain('[[note]]');
  });

  it('preserves a token nested inside three levels of element wrappers', () => {
    // Repro for the parking nested-element issue — only the immediate parent
    // of the token-bearing text node should be parked, never every ancestor.
    const html = `<div><p><span>${insStart('a')}new${insEnd('a')}</span></p></div>`;
    const result = cleanDocx(html, RTF);
    expect(result).toContain(insStart('a'));
    expect(result).toContain(insEnd('a'));
  });

  it('preserves multi-line JSON payloads in tracking tokens', () => {
    const multiLine = `[[DOCX_CMT_START:{"id":"c1",\n"authorName":"Alice",\n"body":"long body"}]]`;
    const html = `<p>${multiLine}body[[DOCX_CMT_END:c1]]</p>`;
    const result = cleanDocx(html, RTF);
    expect(result).toContain(multiLine);
    expect(result).toContain('[[DOCX_CMT_END:c1]]');
  });

  it('preserves adjacent tokens whose payloads contain `]]` lookalikes', () => {
    // Tempered greedy regex must refuse to swallow the next token's prefix.
    const a = `[[DOCX_CMT_START:{"id":"a","body":"first"}]]`;
    const b = `[[DOCX_INS_START:{"id":"b","author":"X"}]]`;
    const html = `<p>${a}body${b}new[[DOCX_INS_END:b]][[DOCX_CMT_END:a]]</p>`;
    const result = cleanDocx(html, RTF);
    expect(result).toContain(a);
    expect(result).toContain(b);
    expect(result).toContain('[[DOCX_INS_END:b]]');
    expect(result).toContain('[[DOCX_CMT_END:a]]');
  });
});
