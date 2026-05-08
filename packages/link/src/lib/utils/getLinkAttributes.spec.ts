import { getLinkAttributes } from './getLinkAttributes';

describe('getLinkAttributes', () => {
  const mockEditor: any = {
    getOptions: () => ({
      allowedSchemes: ['http', 'https'],
      dangerouslySkipSanitization: false,
      defaultLinkAttributes: {},
    }),
  };

  it('should return href', () => {
    const link = { url: 'https://example.com' } as any;
    const attrs = getLinkAttributes(mockEditor, link);
    expect(attrs.href).toBe('https://example.com/');
  });

  it('should set target and append noopener noreferrer when target is _blank', () => {
    const link = { url: 'https://example.com', target: '_blank' } as any;
    const attrs = getLinkAttributes(mockEditor, link);
    expect(attrs.target).toBe('_blank');
    expect(attrs.rel).toBe('noopener noreferrer');
  });

  it('should not overwrite existing rel but append to it when target is _blank', () => {
    const mockEditorWithRel: any = {
      getOptions: () => ({
        allowedSchemes: ['http', 'https'],
        dangerouslySkipSanitization: false,
        defaultLinkAttributes: { rel: 'nofollow' },
      }),
    };
    const link = { url: 'https://example.com', target: '_blank' } as any;
    const attrs = getLinkAttributes(mockEditorWithRel, link);
    expect(attrs.target).toBe('_blank');
    expect(attrs.rel).toBe('nofollow noopener noreferrer');
  });

  it('should not add rel if target is not _blank', () => {
    const link = { url: 'https://example.com', target: '_self' } as any;
    const attrs = getLinkAttributes(mockEditor, link);
    expect(attrs.target).toBe('_self');
    expect(attrs.rel).toBeUndefined();
  });
});
