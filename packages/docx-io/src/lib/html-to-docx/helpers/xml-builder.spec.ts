import { describe, expect, it, vi } from 'vitest';
import { buildRunsFromTextWithTokens } from './xml-builder';
import type { DocxDocumentInstance } from '../helpers/xml-builder'; // Note: DocxDocumentInstance is not exported from xml-builder.ts, we might need to mock or infer it.
// Actually DocxDocumentInstance is defined in xml-builder.ts but not exported.
// However, the function buildRunsFromTextWithTokens takes a type compatible with it.
// We can define a mock interface here.

// Mock types
type MockDocxDocumentInstance = {
  _trackingState?: any;
  comments: any[];
  commentIdMap: Map<string, number>;
  lastCommentId: number;
  revisionIdMap: Map<string, number>;
  lastRevisionId: number;
  ensureComment: (data: any, parentParaId?: string) => number;
  getCommentId: (id: string) => number;
  getRevisionId: (id?: string) => number;
};

describe('buildRunsFromTextWithTokens', () => {
  it('should emit commentRangeEnd for reply with custom ID', () => {
    const parentId = 'parent-1';
    const replyId = 'custom-reply-id';
    const parentNumericId = 100;
    const replyNumericId = 200;

    const mockInstance: MockDocxDocumentInstance = {
      comments: [],
      commentIdMap: new Map(),
      lastCommentId: 0,
      revisionIdMap: new Map(),
      lastRevisionId: 0,
      ensureComment: vi.fn((data: any) => {
        if (data.id === parentId) return parentNumericId;
        if (data.id === replyId) return replyNumericId;
        return 999;
      }),
      getCommentId: vi.fn((id: string) => {
        if (id === parentId) return parentNumericId;
        return 0;
      }),
      getRevisionId: vi.fn(() => 0),
    };

    // Populate commentIdMap as it would be during execution
    mockInstance.commentIdMap.set(parentId, parentNumericId);
    mockInstance.commentIdMap.set(replyId, replyNumericId);

    const tokenText = `[[DOCX_CMT_START:${encodeURIComponent(
      JSON.stringify({
        id: parentId,
        replies: [{ id: replyId, text: 'Reply' }],
      })
    )}]]Comment Text[[DOCX_CMT_END:${encodeURIComponent(parentId)}]]`;

    const fragments = buildRunsFromTextWithTokens(
      tokenText,
      {},
      mockInstance as any
    );

    expect(fragments).not.toBeNull();
    if (!fragments) return;

    // Convert fragments to XML strings for inspection
    const xmlStrings = fragments.map((f) => f.toString());
    const combinedXml = xmlStrings.join('');

    // Check for Parent Start (using regex to be namespace-agnostic)
    expect(combinedXml).toMatch(new RegExp(`commentRangeStart[^>]*id="${parentNumericId}"`));

    // Check for Reply Start
    expect(combinedXml).toMatch(new RegExp(`commentRangeStart[^>]*id="${replyNumericId}"`));

    // Check for Parent End
    expect(combinedXml).toMatch(new RegExp(`commentRangeEnd[^>]*id="${parentNumericId}"`));

    // Check for Reply End - THIS IS THE FIX VERIFICATION
    // This asserts that the fix logic correctly found the reply ID and emitted the end tag
    expect(combinedXml).toMatch(new RegExp(`commentRangeEnd[^>]*id="${replyNumericId}"`));
  });
});
