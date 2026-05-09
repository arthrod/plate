import type { PageNumberFormat } from '../types';

const ROMAN_PAIRS: ReadonlyArray<readonly [number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const toRoman = (n: number): string => {
  if (!Number.isFinite(n) || n <= 0) return '';

  let remaining = Math.floor(n);
  let out = '';

  for (const [value, glyph] of ROMAN_PAIRS) {
    while (remaining >= value) {
      out += glyph;
      remaining -= value;
    }
  }

  return out;
};

const toLetter = (n: number): string => {
  if (!Number.isFinite(n) || n <= 0) return '';

  let remaining = Math.floor(n);
  let out = '';

  while (remaining > 0) {
    const mod = (remaining - 1) % 26;

    out = String.fromCodePoint(65 + mod) + out;
    remaining = Math.floor((remaining - 1) / 26);
  }

  return out;
};

/**
 * Render a page number for the given format.
 *
 * @param format Format token from {@link PageNumberConfig}.
 * @param current Number to display (already offset by `startAt`).
 * @param total Document total (used by `1/N` and `page-of-n`).
 */
export const formatPageNumber = (
  format: PageNumberFormat,
  current: number,
  total: number
): string => {
  switch (format) {
    case '1/N': {
      return `${current}/${total}`;
    }
    case 'letter': {
      return toLetter(current);
    }
    case 'page-of-n': {
      return `Page ${current} of ${total}`;
    }
    case 'roman': {
      return toRoman(current);
    }
    default: {
      return String(current);
    }
  }
};
