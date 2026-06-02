import {
  DEFAULT_PAGE_SETUP,
  type PageSetupConfig,
} from '../../../lib/pageSetup';
import { resolvePageSetupChromeOptions } from '../pageSetupChrome';

const withCfg = (over: Partial<PageSetupConfig>): PageSetupConfig => ({
  ...DEFAULT_PAGE_SETUP,
  ...over,
});

describe('resolvePageSetupChromeOptions', () => {
  it('returns undefined when no band is active', () => {
    expect(
      resolvePageSetupChromeOptions(DEFAULT_PAGE_SETUP, 20)
    ).toBeUndefined();
  });

  it('builds a top band (with a render fn + height) when the page number is on top', () => {
    const chrome = resolvePageSetupChromeOptions(
      withCfg({
        pageNumber: { align: 'center', format: 'arabic', location: 'top' },
      }),
      20
    );

    expect(chrome?.header?.heightPx).toBe(20);
    expect(typeof chrome?.header?.render).toBe('function');
    expect(chrome?.footer).toBeUndefined();
  });

  it('builds a bottom band when the footer has text', () => {
    const chrome = resolvePageSetupChromeOptions(
      withCfg({ footer: { text: 'Confidential' } }),
      18
    );

    expect(chrome?.footer?.heightPx).toBe(18);
    expect(typeof chrome?.footer?.render).toBe('function');
  });

  it('sizes the header band to the stacked line count', () => {
    const chrome = resolvePageSetupChromeOptions(
      withCfg({
        header: { text: 'Title' },
        pageNumber: { align: 'center', format: 'roman-upper', location: 'top' },
      }),
      20
    );

    expect(chrome?.header?.heightPx).toBe(40); // number line + header line
  });
});
