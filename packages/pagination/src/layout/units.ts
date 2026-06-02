// ============================================================
// pagination/layout/units.ts
//
// Length-unit conversion for page geometry. The layout engine is px-native
// (CSS px @ 96dpi); the settings modal lets authors work in inches or cm and
// canonicalizes through here. 96 CSS px per inch; 1 inch = 2.54 cm.
// ============================================================

/** Units the settings UI exposes for margins + page size. */
export type LengthUnit = 'cm' | 'in' | 'px';

/** CSS pixels per CSS inch (the web's fixed 96dpi reference). */
const PX_PER_IN = 96;
/** Centimeters per inch. */
const CM_PER_IN = 2.54;

/**
 * Convert a length authored in `unit` to CSS px @ 96dpi.
 *
 * @example
 * lengthToPx(8.5, 'in') // 816  (US Letter width)
 * lengthToPx(2.54, 'cm') // 96
 */
export function lengthToPx(value: number, unit: LengthUnit): number {
  switch (unit) {
    case 'cm': {
      return (value / CM_PER_IN) * PX_PER_IN;
    }
    case 'in': {
      return value * PX_PER_IN;
    }
    case 'px': {
      return value;
    }
  }
}

/**
 * Convert CSS px @ 96dpi back to `unit`. Inverse of {@link lengthToPx}.
 *
 * @example
 * pxToLength(816, 'in') // 8.5
 */
export function pxToLength(px: number, unit: LengthUnit): number {
  switch (unit) {
    case 'cm': {
      return (px / PX_PER_IN) * CM_PER_IN;
    }
    case 'in': {
      return px / PX_PER_IN;
    }
    case 'px': {
      return px;
    }
  }
}
