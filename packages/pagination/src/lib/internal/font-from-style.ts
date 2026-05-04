/**
 * Resolve a CSSStyleDeclaration into the canonical CSS `font` shorthand
 * understood by canvas/pretext measurement.
 *
 * Variant A keys the measure cache on the resolved font string, so this
 * needs to be deterministic across re-renders of the same node.
 */
export const fontFromStyle = (_style: CSSStyleDeclaration): string => {
  // TODO: variant A — assemble `${weight} ${size}/${lh} ${family}` from the
  // computed style and pass through to the pretext measurer.
  return '';
};
