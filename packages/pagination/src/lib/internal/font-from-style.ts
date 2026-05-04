/**
 * Resolve a pretext-compatible font descriptor from a CSSStyleDeclaration.
 * Lives in `internal/` because the public auto-paginator should not leak the
 * concrete pretext font shape.
 *
 * TODO: variant B — pull `font-family`, `font-size`, `font-weight`,
 * `font-style`, and `letter-spacing` off the computed style and return the
 * exact shape that pretext's measurer accepts.
 */
export type ResolvedFont = {
  family: string;
  size: number;
  weight: number;
  style: 'normal' | 'italic';
  letterSpacing: number;
};

export const fontFromStyle = (_style: CSSStyleDeclaration): ResolvedFont => {
  // TODO: variant B — implement.
  return {
    family: 'sans-serif',
    size: 16,
    weight: 400,
    style: 'normal',
    letterSpacing: 0,
  };
};
