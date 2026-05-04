import { describe, expect, it } from 'bun:test';

import { extractTokens } from './extractTokensForCleaning';

const insStart = (id: string) =>
  `[[DOCX_INS_START:{"id":"${id}","author":"John Doe","date":"2026-01-01T00:00:00Z"}]]`;
const insEnd = (id: string) => `[[DOCX_INS_END:${id}]]`;

describe('extractTokens (variant C — pre-clean stash)', () => {
  it('strips a single insertion pair from html and stashes both tokens', () => {
    const html = `<p>before ${insStart('a')}new${insEnd('a')} after</p>`;
    const { stripped, tokens } = extractTokens(html);

    expect(stripped).toBe('<p>before new after</p>');
    expect(tokens).toHaveLength(2);
    expect(tokens[0].kind).toBe('ins-start');
    expect(tokens[1].kind).toBe('ins-end');
    expect(tokens[0].tokenText).toBe(insStart('a'));
    expect(tokens[1].tokenText).toBe(insEnd('a'));
  });

  it('records 32-character text fingerprints around each token', () => {
    const html = `<p>${'x'.repeat(40)} ${insEnd('a')} ${'y'.repeat(40)}</p>`;
    const { tokens } = extractTokens(html);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].anchorBefore.length).toBeGreaterThan(0);
    expect(tokens[0].anchorBefore.length).toBeLessThanOrEqual(32);
    expect(tokens[0].anchorAfter.length).toBeGreaterThan(0);
    expect(tokens[0].anchorAfter.length).toBeLessThanOrEqual(32);
  });

  it('disambiguates duplicate adjacent tokens via monotonic index', () => {
    const html = `<p>${insStart('a')}same${insEnd('a')} ${insStart('a')}same${insEnd('a')}</p>`;
    const { tokens } = extractTokens(html);
    expect(tokens).toHaveLength(4);
    expect(tokens[0].index).toBe(0);
    expect(tokens[1].index).toBe(1);
    expect(tokens[2].index).toBe(2);
    expect(tokens[3].index).toBe(3);
  });

  it('does not match a user-typed bracket pair like `[[note]]`', () => {
    const html = `<p>see [[note]]</p>`;
    const { stripped, tokens } = extractTokens(html);
    expect(tokens).toHaveLength(0);
    expect(stripped).toBe(html);
  });

  it('returns empty tokens list when no tracking tokens are present', () => {
    const html = `<p>plain document</p>`;
    const { stripped, tokens } = extractTokens(html);
    expect(stripped).toBe(html);
    expect(tokens).toEqual([]);
  });

  it('matches multi-line JSON payloads', () => {
    const multiLine = `[[DOCX_CMT_START:{"id":"c1",\n"authorName":"Alice",\n"body":"long"}]]`;
    const html = `<p>${multiLine}body[[DOCX_CMT_END:c1]]</p>`;
    const { stripped, tokens } = extractTokens(html);
    expect(tokens).toHaveLength(2);
    expect(tokens[0].kind).toBe('cmt-start');
    expect(tokens[0].tokenText).toBe(multiLine);
    expect(stripped).toBe('<p>body</p>');
  });

  it('preserves leading whitespace in fingerprint context', () => {
    // `Word [[T]]` and `Word[[T]]` must produce different anchorBefore
    // fingerprints so the resolver does not collapse them.
    const a = extractTokens(`<p>Word ${insEnd('a')}</p>`);
    const b = extractTokens(`<p>Word${insEnd('a')}</p>`);
    expect(a.tokens[0].anchorBefore).not.toBe(b.tokens[0].anchorBefore);
  });

  it('decodes mdash / rsquo entities into the fingerprint', () => {
    const html = `<p>he said&mdash;&rsquo;hi&rsquo; ${insEnd('a')}</p>`;
    const { tokens } = extractTokens(html);
    expect(tokens[0].anchorBefore).toContain('—');
    expect(tokens[0].anchorBefore).toContain('’');
  });
});
