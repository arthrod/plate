// ============================================================
// pagination/layout/presets.ts
//
// Named page-size presets resolved to CSS px @ 96dpi. Authors pick a preset in
// the settings UI; the engine consumes the resulting PageSpec. Values are the
// canonical print sizes rounded to whole px (A4 = 210×297mm, Letter = 8.5×11in).
// ============================================================

import type { PagePreset, PageSpec } from './types';

const PRESET_SPECS: Record<PagePreset, PageSpec> = {
  // 210mm × 297mm → 794 × 1123 px (matches the engine's historical default).
  a4: { heightPx: 1123, preset: 'a4', widthPx: 794 },
  // 8.5in × 11in → 816 × 1056 px.
  letter: { heightPx: 1056, preset: 'letter', widthPx: 816 },
};

/**
 * Resolve a named page preset to its px {@link PageSpec} @ 96dpi.
 *
 * @example
 * getPresetPageSpec('letter') // { widthPx: 816, heightPx: 1056, preset: 'letter' }
 */
export function getPresetPageSpec(preset: PagePreset): PageSpec {
  return { ...PRESET_SPECS[preset] };
}
