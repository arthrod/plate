import type { PageRect } from '../types';

/** Page presets resolved at 96 DPI. */
export const PAGE_PRESETS: Record<string, { height: number; width: number }> = {
  A4: { height: 1123, width: 794 },
  Letter: { height: 1056, width: 816 },
  Legal: { height: 1344, width: 816 },
};

export const resolvePageRect = (
  pageSize: 'A4' | 'Letter' | (string & {}),
  margins: { bottom: number; left: number; right: number; top: number },
  reservations: { footer: number; footnoteWell: number; header: number }
): PageRect => {
  const preset = PAGE_PRESETS[pageSize] ?? PAGE_PRESETS.A4;
  const contentWidth = preset.width - margins.left - margins.right;
  const contentHeight =
    preset.height -
    margins.top -
    margins.bottom -
    reservations.header -
    reservations.footer -
    reservations.footnoteWell;

  return {
    contentHeight,
    contentWidth,
    height: preset.height,
    width: preset.width,
  };
};
