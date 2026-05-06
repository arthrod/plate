import type { PageMargins, PageRect, PageSize } from '../types';

/** Page presets resolved at 96 DPI. */
export const PAGE_PRESETS: Record<string, { height: number; width: number }> = {
  A4: { height: 1123, width: 794 },
  Legal: { height: 1344, width: 816 },
  Letter: { height: 1056, width: 816 },
};

const isLiteralSize = (
  s: PageSize
): s is { height: number; width: number } =>
  typeof s === 'object' && s !== null && 'width' in s && 'height' in s;

export const resolvePageSize = (
  pageSize: PageSize
): { height: number; width: number } => {
  if (isLiteralSize(pageSize)) return pageSize;

  return PAGE_PRESETS[pageSize as string] ?? PAGE_PRESETS.A4;
};

export const resolvePageRect = (
  pageSize: PageSize,
  margins: PageMargins,
  reservations: { footer: number; footnoteWell: number; header: number }
): PageRect => {
  const preset = resolvePageSize(pageSize);
  const contentWidth = preset.width - margins.left - margins.right;
  const contentHeight =
    preset.height -
    margins.top -
    margins.bottom -
    reservations.header -
    reservations.footer -
    reservations.footnoteWell;

  return {
    contentHeight: Math.max(contentHeight, 0),
    contentWidth: Math.max(contentWidth, 0),
    height: preset.height,
    width: preset.width,
  };
};
