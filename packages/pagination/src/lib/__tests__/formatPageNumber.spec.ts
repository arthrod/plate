import { normalizePageNumber, type PageNumberConfig } from '../pageSetup';
import { formatPageNumber, toRoman } from '../formatPageNumber';

const cfg = (over: Partial<PageNumberConfig> = {}): PageNumberConfig => ({
  align: 'center',
  format: 'arabic',
  location: 'top',
  ...over,
});

describe('toRoman', () => {
  it('converts integers to Roman numerals', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(1990)).toBe('MCMXC');
  });

  it('returns empty string for non-positive', () => {
    expect(toRoman(0)).toBe('');
  });
});

describe('formatPageNumber', () => {
  it('formats arabic', () => {
    expect(formatPageNumber(cfg({ format: 'arabic' }), 3, 7)).toBe('3');
  });

  it('formats roman upper + lower', () => {
    expect(formatPageNumber(cfg({ format: 'roman-upper' }), 3, 7)).toBe('III');
    expect(formatPageNumber(cfg({ format: 'roman-lower' }), 3, 7)).toBe('iii');
  });

  it('formats custom with {n} and {total} placeholders', () => {
    expect(
      formatPageNumber(
        cfg({ customText: 'Page {n} of {total}', format: 'custom' }),
        3,
        7
      )
    ).toBe('Page 3 of 7');
  });

  it('clamps custom text to 500 chars', () => {
    const long = 'x'.repeat(600);
    expect(
      formatPageNumber(cfg({ customText: long, format: 'custom' }), 1, 1).length
    ).toBe(500);
  });

  it('returns empty string for none', () => {
    expect(formatPageNumber(cfg({ format: 'none' }), 3, 7)).toBe('');
  });
});

describe('normalizePageNumber', () => {
  it('auto-picks top location when a format is chosen but location is none', () => {
    expect(
      normalizePageNumber(cfg({ format: 'roman-upper', location: 'none' }))
        .location
    ).toBe('top');
  });

  it('auto-picks arabic format when a location is chosen but format is none', () => {
    expect(
      normalizePageNumber(cfg({ format: 'none', location: 'bottom' })).format
    ).toBe('arabic');
  });

  it('leaves both-none and both-set untouched', () => {
    expect(
      normalizePageNumber(cfg({ format: 'none', location: 'none' }))
    ).toEqual(cfg({ format: 'none', location: 'none' }));
    expect(
      normalizePageNumber(cfg({ format: 'arabic', location: 'bottom' }))
        .location
    ).toBe('bottom');
  });
});
