import { DEFAULT_PAGE_SETUP, type PageSetupConfig } from '../pageSetup';
import {
  chromeBandLines,
  pageNumberLocation,
  pageSetupToLayoutInput,
  resolveChromeBands,
} from '../resolvePageSetup';

const policies = {
  keepWithNextEnabled: true,
  orphanLinesMin: 2,
  widowLinesMin: 2,
};
const LH = 20;
const withCfg = (over: Partial<PageSetupConfig>): PageSetupConfig => ({
  ...DEFAULT_PAGE_SETUP,
  ...over,
});

describe('pageNumberLocation', () => {
  it('is null when format or location is none', () => {
    expect(pageNumberLocation(DEFAULT_PAGE_SETUP)).toBeNull();
    expect(
      pageNumberLocation(
        withCfg({
          pageNumber: { align: 'center', format: 'arabic', location: 'none' },
        })
      )
    ).toBeNull();
  });

  it('returns the configured location when both are set', () => {
    expect(
      pageNumberLocation(
        withCfg({
          pageNumber: { align: 'center', format: 'arabic', location: 'bottom' },
        })
      )
    ).toBe('bottom');
  });
});

describe('chromeBandLines', () => {
  it('counts no lines for the default (empty) setup', () => {
    expect(chromeBandLines(DEFAULT_PAGE_SETUP)).toEqual({ bottom: 0, top: 0 });
  });

  it('stacks the top band: page number (top) above the header', () => {
    const lines = chromeBandLines(
      withCfg({
        header: { text: 'Title' },
        pageNumber: { align: 'center', format: 'arabic', location: 'top' },
      })
    );
    expect(lines.top).toBe(2);
    expect(lines.bottom).toBe(0);
  });

  it('stacks the bottom band: footnote + footer + page number (bottom)', () => {
    const lines = chromeBandLines(
      withCfg({
        footer: { text: 'Confidential' },
        footnotes: 'footnote',
        pageNumber: {
          align: 'right',
          format: 'roman-upper',
          location: 'bottom',
        },
      })
    );
    expect(lines.bottom).toBe(3);
    expect(lines.top).toBe(0);
  });

  it('does not reserve a footnote line for endnote mode', () => {
    expect(chromeBandLines(withCfg({ footnotes: 'endnote' })).bottom).toBe(0);
  });
});

describe('resolveChromeBands', () => {
  it('returns undefined when no band is active', () => {
    expect(resolveChromeBands(DEFAULT_PAGE_SETUP, LH)).toBeUndefined();
  });

  it('sizes bands to stacked line count × lineHeightPx', () => {
    const bands = resolveChromeBands(
      withCfg({
        header: { text: 'Title' },
        pageNumber: { align: 'center', format: 'arabic', location: 'top' },
      }),
      LH
    );
    expect(bands?.header?.heightPx).toBe(2 * LH);
    expect(bands?.footer).toBeUndefined();
  });
});

describe('pageSetupToLayoutInput', () => {
  it('carries geometry + content-sized chrome', () => {
    const input = pageSetupToLayoutInput(
      withCfg({
        pageNumber: { align: 'center', format: 'arabic', location: 'top' },
      }),
      policies,
      LH
    );
    expect(input.page).toEqual(DEFAULT_PAGE_SETUP.page);
    expect(input.policies).toBe(policies);
    expect(input.chrome?.header?.heightPx).toBe(LH);
  });
});
