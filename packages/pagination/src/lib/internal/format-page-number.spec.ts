import { describe, expect, it } from 'bun:test';

import { formatPageNumber } from './format-page-number';

describe('formatPageNumber', () => {
  it('decimal renders the current number as-is', () => {
    expect(formatPageNumber('decimal', 1, 10)).toBe('1');
    expect(formatPageNumber('decimal', 42, 100)).toBe('42');
  });

  it('1/N renders current / total', () => {
    expect(formatPageNumber('1/N', 3, 12)).toBe('3/12');
  });

  it('page-of-n renders the prose form', () => {
    expect(formatPageNumber('page-of-n', 5, 9)).toBe('Page 5 of 9');
  });

  it('roman handles standard cases', () => {
    expect(formatPageNumber('roman', 1, 0)).toBe('I');
    expect(formatPageNumber('roman', 4, 0)).toBe('IV');
    expect(formatPageNumber('roman', 9, 0)).toBe('IX');
    expect(formatPageNumber('roman', 14, 0)).toBe('XIV');
    expect(formatPageNumber('roman', 1994, 0)).toBe('MCMXCIV');
  });

  it('roman returns empty for non-positive', () => {
    expect(formatPageNumber('roman', 0, 0)).toBe('');
    expect(formatPageNumber('roman', -1, 0)).toBe('');
  });

  it('letter renders A..Z then AA, AB, ...', () => {
    expect(formatPageNumber('letter', 1, 0)).toBe('A');
    expect(formatPageNumber('letter', 26, 0)).toBe('Z');
    expect(formatPageNumber('letter', 27, 0)).toBe('AA');
    expect(formatPageNumber('letter', 28, 0)).toBe('AB');
    expect(formatPageNumber('letter', 52, 0)).toBe('AZ');
    expect(formatPageNumber('letter', 53, 0)).toBe('BA');
  });

  it('letter returns empty for non-positive', () => {
    expect(formatPageNumber('letter', 0, 0)).toBe('');
  });
});
