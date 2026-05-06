/**
 * CSS-pixel ↔ physical-unit conversions at the standard 96 DPI used by
 * browser layout (CSS spec). 1in = 96px; 1cm = 96 / 2.54 ≈ 37.795px.
 *
 * Keeps the wire format (margins, page rect) in CSS pixels while letting UI
 * forms accept cm or in input — convert on blur with these helpers, never
 * inside the plugin internals.
 */
const PX_PER_IN = 96;
const PX_PER_CM = 96 / 2.54;

export const cmToPx = (cm: number): number => Math.round(cm * PX_PER_CM);
export const inToPx = (inches: number): number =>
  Math.round(inches * PX_PER_IN);
export const pxToCm = (px: number): number => px / PX_PER_CM;
export const pxToIn = (px: number): number => px / PX_PER_IN;
