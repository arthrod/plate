import { lengthToPx, pxToLength } from '../units';

// 96 CSS px per inch; 1 inch = 2.54 cm. The pagination engine is px-native; the
// settings modal authors values in inches/cm/px and canonicalizes through these.
describe('lengthToPx', () => {
  it('converts inches to px at 96dpi', () => {
    expect(lengthToPx(1, 'in')).toBe(96);
    expect(lengthToPx(8.5, 'in')).toBe(816); // US Letter width
    expect(lengthToPx(11, 'in')).toBe(1056); // US Letter height
  });

  it('converts cm to px at 96dpi', () => {
    expect(lengthToPx(2.54, 'cm')).toBeCloseTo(96, 6);
  });

  it('treats px as identity', () => {
    expect(lengthToPx(42, 'px')).toBe(42);
  });
});

describe('pxToLength', () => {
  it('is the inverse of lengthToPx for inches', () => {
    expect(pxToLength(96, 'in')).toBeCloseTo(1, 6);
    expect(pxToLength(816, 'in')).toBeCloseTo(8.5, 6);
  });

  it('is the inverse of lengthToPx for cm', () => {
    expect(pxToLength(96, 'cm')).toBeCloseTo(2.54, 6);
  });

  it('treats px as identity', () => {
    expect(pxToLength(42, 'px')).toBe(42);
  });
});
