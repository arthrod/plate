// ============================================================
// pagination/lib/formatPageNumber.ts
//
// Pure rendering of the running page number from a PageNumberConfig. No DOM, no
// React — deterministic and directly unit-testable.
// ============================================================

import type { PageNumberConfig } from './pageSetup';

import { PAGE_NUMBER_CUSTOM_MAX } from './pageSetup';

const ROMAN: [number, string][] = [
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

/** Convert a positive integer to an (upper-case) Roman numeral; `''` for n ≤ 0. */
export function toRoman(n: number): string {
  let remaining = Math.floor(n);
  if (remaining <= 0) return '';

  let out = '';
  for (const [value, symbol] of ROMAN) {
    while (remaining >= value) {
      out += symbol;
      remaining -= value;
    }
  }

  return out;
}

/**
 * Render the page-number string for a 1-based page `n` of `total`.
 *
 * - `arabic` → `"3"`
 * - `roman-upper` / `roman-lower` → `"III"` / `"iii"`
 * - `custom` → `customText` with `{n}`/`{total}` substituted, clamped to 500 chars
 * - `none` → `""` (caller renders no band)
 */
export function formatPageNumber(
  config: PageNumberConfig,
  n: number,
  total: number
): string {
  switch (config.format) {
    case 'arabic': {
      return String(n);
    }
    case 'custom': {
      return (config.customText ?? '')
        .replaceAll('{n}', String(n))
        .replaceAll('{total}', String(total))
        .slice(0, PAGE_NUMBER_CUSTOM_MAX);
    }
    case 'roman-lower': {
      return toRoman(n).toLowerCase();
    }
    case 'roman-upper': {
      return toRoman(n);
    }
    default: {
      return '';
    }
  }
}
