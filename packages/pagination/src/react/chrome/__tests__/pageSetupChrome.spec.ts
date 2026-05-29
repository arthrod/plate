import { DEFAULT_PAGE_SETUP } from '../../../lib/pageSetup';
import {
  pageNumberAlign,
  resolvePageSetupChromeOptions,
} from '../pageSetupChrome';

describe('pageNumberAlign', () => {
  it('maps a page-number position to its horizontal alignment', () => {
    expect(pageNumberAlign('footer-center')).toBe('center');
    expect(pageNumberAlign('header-left')).toBe('left');
    expect(pageNumberAlign('footer-right')).toBe('right');
  });

  it('returns null when the page number is omitted', () => {
    expect(pageNumberAlign('none')).toBeNull();
  });
});

describe('resolvePageSetupChromeOptions', () => {
  it('returns undefined when no band is active', () => {
    expect(resolvePageSetupChromeOptions(DEFAULT_PAGE_SETUP)).toBeUndefined();
  });

  it('builds a footer chrome option (with a render fn + height) for a footer page number', () => {
    const chrome = resolvePageSetupChromeOptions({
      ...DEFAULT_PAGE_SETUP,
      pageNumber: 'footer-center',
    });

    expect(chrome?.footer?.heightPx).toBeGreaterThan(0);
    expect(typeof chrome?.footer?.render).toBe('function');
    expect(chrome?.header).toBeUndefined();
  });

  it('builds a header chrome option when the header has text', () => {
    const chrome = resolvePageSetupChromeOptions({
      ...DEFAULT_PAGE_SETUP,
      header: { text: 'Confidential' },
    });

    expect(chrome?.header?.heightPx).toBeGreaterThan(0);
    expect(typeof chrome?.header?.render).toBe('function');
  });
});
