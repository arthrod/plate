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

describe('cleanDocx tracking-token round-trip (variant A — DOM placeholder swap)', () => {
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

  it('keeps a token through cleanDocxSpans unwrapping a mso-styled span', () => {
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
    // No placeholder span should remain.
    expect(result).not.toContain('data-docx-tracking-token');
  });
});
