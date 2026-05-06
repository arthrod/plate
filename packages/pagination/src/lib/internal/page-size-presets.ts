import type { MarginValue, PageMargins, PageRect, PageSize } from '../types';

/** Page presets resolved at 96 DPI. */
export const PAGE_PRESETS: Record<string, { height: number; width: number }> = {
  A4: { height: 1123, width: 794 },
  Legal: { height: 1344, width: 816 },
  Letter: { height: 1056, width: 816 },
};

const isLiteralSize = (s: PageSize): s is { height: number; width: number } =>
  typeof s === 'object' && s !== null && 'width' in s && 'height' in s;

export const resolvePageSize = (
  pageSize: PageSize
): { height: number; width: number } => {
  if (isLiteralSize(pageSize)) return pageSize;

  return PAGE_PRESETS[pageSize as string] ?? PAGE_PRESETS.A4;
};

/**
 * Convert a {@link MarginValue} to CSS pixels at 96 DPI.
 *
 * - `number` → treated as px directly.
 * - `'<n>px'` → identity.
 * - `'<n>in'` → × 96.
 * - `'<n>cm'` → × (96 / 2.54).
 * - `'<n>mm'` → × (96 / 25.4).
 * - `'<n>pt'` → × (96 / 72).
 *
 * Any unrecognised string falls back to `parseFloat` (i.e. strips the unit
 * and treats the number as px — a safe default rather than silently returning
 * 0).
 */
export const resolveMarginValue = (v: MarginValue): number => {
  if (typeof v === 'number') return v;

  const trimmed = v.trim();
  const match = /^(-?[\d.]+)\s*(px|in|cm|mm|pt)$/i.exec(trimmed);

  if (!match) return Number.parseFloat(trimmed) || 0;

  const n = Number.parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'px':
      return n;
    case 'in':
      return n * 96;
    case 'cm':
      return n * (96 / 2.54);
    case 'mm':
      return n * (96 / 25.4);
    case 'pt':
      return n * (96 / 72);
    default:
      return n;
  }
};

/** Resolve all four sides of a {@link PageMargins} to CSS pixels. */
export const resolveMargins = (
  margins: PageMargins
): { bottom: number; left: number; right: number; top: number } => ({
  bottom: resolveMarginValue(margins.bottom),
  left: resolveMarginValue(margins.left),
  right: resolveMarginValue(margins.right),
  top: resolveMarginValue(margins.top),
});

export const resolvePageRect = (
  pageSize: PageSize,
  margins: PageMargins,
  reservations: { footer: number; footnoteWell: number; header: number }
): PageRect => {
  const preset = resolvePageSize(pageSize);
  const m = resolveMargins(margins);
  const contentWidth = preset.width - m.left - m.right;
  const contentHeight =
    preset.height -
    m.top -
    m.bottom -
    reservations.header -
    reservations.footer -
    reservations.footnoteWell;

  return {
    contentHeight: Math.max(contentHeight, 0),
    contentWidth: Math.max(contentWidth, 0),
    height: preset.height,
    width: preset.width,
    margins: m,
  };
};
