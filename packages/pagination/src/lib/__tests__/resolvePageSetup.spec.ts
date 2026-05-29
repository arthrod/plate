import { DEFAULT_PAGE_SETUP } from '../pageSetup';
import {
  pageNumberBand,
  pageSetupToLayoutInput,
  resolveChromeBands,
} from '../resolvePageSetup';

const policies = {
  keepWithNextEnabled: true,
  orphanLinesMin: 2,
  widowLinesMin: 2,
};

describe('pageNumberBand', () => {
  it('maps header positions to the header band', () => {
    expect(pageNumberBand('header-center')).toBe('header');
    expect(pageNumberBand('header-right')).toBe('header');
  });

  it('maps footer positions to the footer band', () => {
    expect(pageNumberBand('footer-left')).toBe('footer');
  });

  it('maps none to no band', () => {
    expect(pageNumberBand('none')).toBeNull();
  });
});

describe('resolveChromeBands', () => {
  it('reserves no bands when there is no chrome content or page number', () => {
    expect(resolveChromeBands(DEFAULT_PAGE_SETUP)).toBeUndefined();
  });

  it('reserves a footer band when the page number sits in the footer', () => {
    const bands = resolveChromeBands({
      ...DEFAULT_PAGE_SETUP,
      pageNumber: 'footer-center',
    });

    expect(bands?.footer?.heightPx).toBeGreaterThan(0);
    expect(bands?.header).toBeUndefined();
  });

  it('reserves a header band when the header has text', () => {
    const bands = resolveChromeBands({
      ...DEFAULT_PAGE_SETUP,
      header: { text: 'Confidential' },
    });

    expect(bands?.header?.heightPx).toBeGreaterThan(0);
  });

  it('reserves both bands when header text and a footer page number coexist', () => {
    const bands = resolveChromeBands({
      ...DEFAULT_PAGE_SETUP,
      header: { text: 'Title' },
      pageNumber: 'footer-right',
    });

    expect(bands?.header?.heightPx).toBeGreaterThan(0);
    expect(bands?.footer?.heightPx).toBeGreaterThan(0);
  });
});

describe('pageSetupToLayoutInput', () => {
  it('carries page, margins, and policies through', () => {
    const input = pageSetupToLayoutInput(DEFAULT_PAGE_SETUP, policies);

    expect(input.page).toEqual(DEFAULT_PAGE_SETUP.page);
    expect(input.margins).toEqual(DEFAULT_PAGE_SETUP.margins);
    expect(input.policies).toBe(policies);
  });

  it('omits chrome when no bands are active', () => {
    expect(
      pageSetupToLayoutInput(DEFAULT_PAGE_SETUP, policies).chrome
    ).toBeUndefined();
  });

  it('includes chrome bands when the page number is shown', () => {
    const input = pageSetupToLayoutInput(
      { ...DEFAULT_PAGE_SETUP, pageNumber: 'footer-center' },
      policies
    );

    expect(input.chrome?.footer?.heightPx).toBeGreaterThan(0);
  });
});
