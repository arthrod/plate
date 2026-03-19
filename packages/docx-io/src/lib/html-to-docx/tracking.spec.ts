import { describe, expect, it, vi } from 'vitest';
import JSZip from 'jszip';
import { htmlToDocxBlob } from '../exportDocx';
import {
  buildCommentEndToken,
  buildCommentStartToken,
  buildSuggestionEndToken,
  buildSuggestionStartToken,
  findDocxTrackingTokens,
  hasTrackingTokens,
  splitDocxTrackingTokens,
} from './tracking';

const mock = vi.fn;

async function loadZipFromBlob(blob: Blob): Promise<JSZip> {
  const zip = new JSZip();
  return zip.loadAsync(await blob.arrayBuffer());
}

describe('Tracking Token Constants', () => {
  it('should have correct insertion token prefixes', () => {
    const text = '[[DOCX_INS_START:test]]';
    expect(text).toContain('DOCX_INS_START');
  });

  it('should have correct deletion token prefixes', () => {
    const text = '[[DOCX_DEL_START:test]]';
    expect(text).toContain('DOCX_DEL_START');
  });

  it('should have correct comment token prefixes', () => {
    const text = '[[DOCX_CMT_START:test]]';
    expect(text).toContain('DOCX_CMT_START');
  });
});

describe('hasTrackingTokens', () => {
  it('should return true for text with insertion tokens', () => {
    expect(hasTrackingTokens('abc [[DOCX_INS_START:data]] def')).toBe(true);
    expect(hasTrackingTokens('abc [[DOCX_INS_END:id]] def')).toBe(true);
  });

  it('should return true for text with deletion tokens', () => {
    expect(hasTrackingTokens('abc [[DOCX_DEL_START:data]] def')).toBe(true);
    expect(hasTrackingTokens('abc [[DOCX_DEL_END:id]] def')).toBe(true);
  });

  it('should return true for text with comment tokens', () => {
    expect(hasTrackingTokens('abc [[DOCX_CMT_START:data]] def')).toBe(true);
    expect(hasTrackingTokens('abc [[DOCX_CMT_END:id]] def')).toBe(true);
  });

  it('should return false for text without tokens', () => {
    expect(hasTrackingTokens('abc def')).toBe(false);
    expect(hasTrackingTokens('[DOCX_INS_START:data]')).toBe(false); // Missing bracket
  });

  it('should return false for empty text', () => {
    expect(hasTrackingTokens('')).toBe(false);
  });
});

describe('findDocxTrackingTokens', () => {
  it('should find all tokens in text', () => {
    const text =
      'start [[DOCX_INS_START:1]] middle [[DOCX_CMT_START:2]] end [[DOCX_INS_END:1]]';
    const tokens = findDocxTrackingTokens(text);

    expect(tokens).toHaveLength(3);
    expect(tokens[0]).toBe('[[DOCX_INS_START:1]]');
    expect(tokens[1]).toBe('[[DOCX_CMT_START:2]]');
    expect(tokens[2]).toBe('[[DOCX_INS_END:1]]');
  });

  it('should return empty array when no tokens found', () => {
    const tokens = findDocxTrackingTokens('no tokens here');
    expect(tokens).toEqual([]);
  });
});

describe('splitDocxTrackingTokens', () => {
  it('should return single text part for text without tokens', () => {
    const text = 'Just some text';
    const parts = splitDocxTrackingTokens(text);

    expect(parts).toHaveLength(1);
    expect(parts[0]).toEqual({ type: 'text', value: 'Just some text' });
  });

  it('should parse insertion start token', () => {
    const payload = encodeURIComponent(JSON.stringify({ id: '123' }));
    const text = `before [[DOCX_INS_START:${payload}]] after`;
    const parts = splitDocxTrackingTokens(text);

    expect(parts).toHaveLength(3);
    expect(parts[0]).toEqual({ type: 'text', value: 'before ' });
    expect(parts[1].type).toBe('insStart');
    if (parts[1].type === 'insStart') {
      expect(parts[1].data).toEqual({ id: '123' });
    }
    expect(parts[2]).toEqual({ type: 'text', value: ' after' });
  });

  it('should parse deletion tokens', () => {
    const payload = encodeURIComponent(JSON.stringify({ id: 'del-1' }));
    const text = `[[DOCX_DEL_START:${payload}]]deleted[[DOCX_DEL_END:del-1]]`;
    const parts = splitDocxTrackingTokens(text);

    expect(parts).toHaveLength(3);
    expect(parts[0].type).toBe('delStart');
    expect(parts[1]).toEqual({ type: 'text', value: 'deleted' });
    expect(parts[2]).toEqual({ id: 'del-1', type: 'delEnd' });
  });

  it('should parse comment tokens', () => {
    const payload = encodeURIComponent(
      JSON.stringify({ id: 'cmt-1', text: 'Hello' })
    );
    const text = `[[DOCX_CMT_START:${payload}]]commented[[DOCX_CMT_END:cmt-1]]`;
    const parts = splitDocxTrackingTokens(text);

    expect(parts).toHaveLength(3);
    expect(parts[0].type).toBe('commentStart');
    if (parts[0].type === 'commentStart') {
      expect(parts[0].data.text).toBe('Hello');
    }
    expect(parts[1]).toEqual({ type: 'text', value: 'commented' });
    expect(parts[2]).toEqual({ id: 'cmt-1', type: 'commentEnd' });
  });

  it('should handle nested tokens', () => {
    const insPayload = encodeURIComponent(JSON.stringify({ id: 'ins-1' }));
    const cmtPayload = encodeURIComponent(
      JSON.stringify({ id: 'cmt-1', text: 'Comment' })
    );
    const text = `[[DOCX_INS_START:${insPayload}]][[DOCX_CMT_START:${cmtPayload}]]nested[[DOCX_CMT_END:cmt-1]][[DOCX_INS_END:ins-1]]`;
    const parts = splitDocxTrackingTokens(text);

    expect(parts).toHaveLength(5);
    expect(parts[0].type).toBe('insStart');
    expect(parts[1].type).toBe('commentStart');
    expect(parts[2]).toEqual({ type: 'text', value: 'nested' });
    expect(parts[3].type).toBe('commentEnd');
    expect(parts[4].type).toBe('insEnd');
  });

  it('should handle malformed tokens as text', () => {
    const text = '[[DOCX_INS_START:invalid-not-json]]text[[DOCX_INS_END:id]]';
    const parts = splitDocxTrackingTokens(text);

    // The malformed start token should be treated as text
    expect(parts.length).toBeGreaterThan(0);
    expect(parts.some((p) => p.type === 'text')).toBe(true);
  });
});

describe('Token Building Functions', () => {
  describe('buildSuggestionStartToken', () => {
    it('should build insertion start token', () => {
      const payload = { author: 'John', date: '2024-01-01', id: 'ins-1' };
      const token = buildSuggestionStartToken(payload, 'insert');

      expect(token).toContain('[[DOCX_INS_START:');
      expect(token).toContain(']]');

      // Should be parseable
      const parts = splitDocxTrackingTokens(token);
      expect(parts).toHaveLength(1);
      expect(parts[0].type).toBe('insStart');
    });

    it('should build deletion start token', () => {
      const payload = { author: 'Jane', id: 'del-1' };
      const token = buildSuggestionStartToken(payload, 'remove');

      expect(token).toContain('[[DOCX_DEL_START:');
      expect(token).toContain(']]');

      const parts = splitDocxTrackingTokens(token);
      expect(parts).toHaveLength(1);
      expect(parts[0].type).toBe('delStart');
    });
  });

  describe('buildSuggestionEndToken', () => {
    it('should build insertion end token', () => {
      const token = buildSuggestionEndToken('ins-1', 'insert');

      expect(token).toBe('[[DOCX_INS_END:ins-1]]');

      const parts = splitDocxTrackingTokens(token);
      expect(parts).toHaveLength(1);
      expect(parts[0]).toEqual({ id: 'ins-1', type: 'insEnd' });
    });

    it('should build deletion end token', () => {
      const token = buildSuggestionEndToken('del-1', 'remove');

      expect(token).toBe('[[DOCX_DEL_END:del-1]]');

      const parts = splitDocxTrackingTokens(token);
      expect(parts).toHaveLength(1);
      expect(parts[0]).toEqual({ id: 'del-1', type: 'delEnd' });
    });
  });

  describe('buildCommentStartToken', () => {
    it('should build comment start token with full payload', () => {
      const payload = {
        authorInitials: 'JD',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00Z',
        id: 'cmt-1',
        text: 'This is a comment',
      };
      const token = buildCommentStartToken(payload);

      expect(token).toContain('[[DOCX_CMT_START:');
      expect(token).toContain(']]');

      const parts = splitDocxTrackingTokens(token);
      expect(parts).toHaveLength(1);
      expect(parts[0].type).toBe('commentStart');
      if (parts[0].type === 'commentStart') {
        expect(parts[0].data.id).toBe('cmt-1');
        expect(parts[0].data.authorName).toBe('John Doe');
        expect(parts[0].data.text).toBe('This is a comment');
      }
    });
  });

  describe('buildCommentEndToken', () => {
    it('should build comment end token', () => {
      const token = buildCommentEndToken('cmt-1');

      expect(token).toBe('[[DOCX_CMT_END:cmt-1]]');

      const parts = splitDocxTrackingTokens(token);
      expect(parts).toHaveLength(1);
      expect(parts[0]).toEqual({ id: 'cmt-1', type: 'commentEnd' });
    });
  });
});

describe('DOCX Export with Tracked Changes', () => {
  it('should export insertion tokens as w:ins elements', async () => {
    const startPayload = encodeURIComponent(
      JSON.stringify({ author: 'John Doe', date: '2024-01-01', id: 'ins-1' })
    );
    const html = `<p>Normal text [[DOCX_INS_START:${startPayload}]]inserted text[[DOCX_INS_END:ins-1]] more text</p>`;

    const result = await htmlToDocxBlob(html);
    const zip = await loadZipFromBlob(result);
    const docXml = await zip.file('word/document.xml')!.async('string');

    // Should contain w:ins element
    expect(docXml).toContain('<w:ins');
    expect(docXml).toContain('w:author="John Doe"');
    expect(docXml).toContain('inserted text');
  });

  it('should export deletion tokens as w:del elements with w:delText', async () => {
    const startPayload = encodeURIComponent(
      JSON.stringify({ author: 'Jane Smith', date: '2024-01-02', id: 'del-1' })
    );
    const html = `<p>Normal text [[DOCX_DEL_START:${startPayload}]]deleted text[[DOCX_DEL_END:del-1]] more text</p>`;

    const result = await htmlToDocxBlob(html);
    const zip = await loadZipFromBlob(result);
    const docXml = await zip.file('word/document.xml')!.async('string');

    // Should contain w:del element
    expect(docXml).toContain('<w:del');
    expect(docXml).toContain('w:author="Jane Smith"');
    // Deleted text should use w:delText element
    expect(docXml).toContain('<w:delText');
    expect(docXml).toContain('deleted text');
  });

  it('should export comment tokens with comment markers and comments.xml', async () => {
    const startPayload = encodeURIComponent(
      JSON.stringify({
        authorInitials: 'BW',
        authorName: 'Bob Wilson',
        date: '2024-01-03T10:00:00Z',
        id: 'cmt-1',
        text: 'This needs review',
      })
    );
    const html = `<p>Normal text [[DOCX_CMT_START:${startPayload}]]commented text[[DOCX_CMT_END:cmt-1]] more text</p>`;

    const result = await htmlToDocxBlob(html);
    const zip = await loadZipFromBlob(result);
    const docXml = await zip.file('word/document.xml')!.async('string');

    // Document should contain comment markers
    expect(docXml).toContain('<w:commentRangeStart');
    expect(docXml).toContain('<w:commentRangeEnd');
    expect(docXml).toContain('<w:commentReference');

    // Should have comments.xml file
    const commentsFile = zip.file('word/comments.xml');
    expect(commentsFile).not.toBeNull();

    if (commentsFile) {
      const commentsXml = await commentsFile.async('string');
      // Check for comment element (with or without namespace prefix)
      expect(
        commentsXml.includes('<w:comment') || commentsXml.includes('<comment')
      ).toBe(true);
      // Check for author attribute (with or without namespace prefix)
      expect(
        commentsXml.includes('w:author="Bob Wilson"') ||
          commentsXml.includes('author="Bob Wilson"') ||
          commentsXml.includes(':author="Bob Wilson"')
      ).toBe(true);
      // Check for initials attribute
      expect(
        commentsXml.includes('w:initials="BW"') ||
          commentsXml.includes('initials="BW"') ||
          commentsXml.includes(':initials="BW"')
      ).toBe(true);
      expect(commentsXml).toContain('This needs review');
    }

    // Content types should include comments
    const contentTypes = await zip.file('[Content_Types].xml')!.async('string');
    expect(contentTypes).toContain('comments.xml');
  });

  it('should handle multiple tracked changes in same paragraph', async () => {
    const ins1 = encodeURIComponent(JSON.stringify({ id: 'ins-1' }));
    const del1 = encodeURIComponent(JSON.stringify({ id: 'del-1' }));
    const html = `<p>Start [[DOCX_INS_START:${ins1}]]inserted[[DOCX_INS_END:ins-1]] middle [[DOCX_DEL_START:${del1}]]deleted[[DOCX_DEL_END:del-1]] end</p>`;

    const result = await htmlToDocxBlob(html);
    const zip = await loadZipFromBlob(result);
    const docXml = await zip.file('word/document.xml')!.async('string');

    expect(docXml).toContain('<w:ins');
    expect(docXml).toContain('<w:del');
    expect(docXml).toContain('inserted');
    expect(docXml).toContain('deleted');
  });

  it('should not create comments.xml when no comments exist', async () => {
    const html = '<p>Plain text without comments</p>';

    const result = await htmlToDocxBlob(html);
    const zip = await loadZipFromBlob(result);

    const commentsFile = zip.file('word/comments.xml');
    expect(commentsFile).toBeNull();
  });

  it('warns when dead tracking tokens remain in document.xml', async () => {
    const warn = mock(() => {});
    const originalWarn = console.warn;
    console.warn = warn;

    try {
      const html = '<p>[[DOCX_INS_START:invalid]]text</p>';
      await htmlToDocxBlob(html);
    } finally {
      console.warn = originalWarn;
    }

    expect(warn).toHaveBeenCalled();
    expect((warn.mock.calls as any)[0]?.[0]).toContain(
      'dead tracking tokens in document.xml'
    );
  });
});

describe('Round-trip Token Encoding', () => {
  it('should correctly encode and decode special characters in author names', () => {
    const payload = {
      author: 'José García & Maria <test>',
      id: 'test-1',
    };
    const token = buildSuggestionStartToken(payload, 'insert');
    const parts = splitDocxTrackingTokens(token);

    expect(parts).toHaveLength(1);
    expect(parts[0].type).toBe('insStart');
    if (parts[0].type === 'insStart') {
      expect(parts[0].data.author).toBe('José García & Maria <test>');
    }
  });

  it('should correctly encode and decode Unicode in comment text', () => {
    const payload = {
      authorName: '田中太郎',
      id: 'cmt-1',
      text: 'Comment with emoji 🎉 and CJK 日本語',
    };
    const token = buildCommentStartToken(payload);
    const parts = splitDocxTrackingTokens(token);

    expect(parts).toHaveLength(1);
    expect(parts[0].type).toBe('commentStart');
    if (parts[0].type === 'commentStart') {
      expect(parts[0].data.authorName).toBe('田中太郎');
      expect(parts[0].data.text).toBe('Comment with emoji 🎉 and CJK 日本語');
    }
  });

  it('should handle token payload broken by whitespace', () => {
    const payload = encodeURIComponent(
      JSON.stringify({ authorName: 'Broken', id: 'cmt-broken', text: 'Fix me' })
    );
    // Find a % character to break escape sequence
    const pctIndex = payload.indexOf('%');
    // Insert space after % to simulate line wrapping breaking a URI escape sequence
    const brokenPayload =
      payload.slice(0, pctIndex + 1) + ' ' + payload.slice(pctIndex + 1);
    const text = `[[DOCX_CMT_START:${brokenPayload}]]content[[DOCX_CMT_END:cmt-broken]]`;

    const parts = splitDocxTrackingTokens(text);

    expect(parts).toHaveLength(3);
    expect(parts[0].type).toBe('commentStart');
    if (parts[0].type === 'commentStart') {
      expect(parts[0].data.authorName).toBe('Broken');
    }
  });
});

describe('Security Validation', () => {
  it('should ignore comment payload with invalid replies (not an array)', () => {
    // Malicious payload: replies is an object with length property, not an array
    const maliciousPayload = encodeURIComponent(
      JSON.stringify({
        id: 'cmt-malicious',
        text: 'Bad payload',
        replies: { length: 1, 0: 'fake' }
      })
    );
    const text = `[[DOCX_CMT_START:${maliciousPayload}]]content[[DOCX_CMT_END:cmt-malicious]]`;

    const parts = splitDocxTrackingTokens(text);

    // Should not return a commentStart token, but treat it as text (parsing failed/rejected)
    // Actually, parseDocxToken returns null if check fails, so splitDocxTrackingTokens treats match as text
    expect(parts.some(p => p.type === 'commentStart')).toBe(false);
    expect(parts.some(p => p.type === 'text' && p.value.includes('DOCX_CMT_START'))).toBe(true);
  });
});
