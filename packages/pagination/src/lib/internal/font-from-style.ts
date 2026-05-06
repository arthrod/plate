/**
 * Resolve a CSSStyleDeclaration into the canonical CSS `font` shorthand
 * understood by `CanvasRenderingContext2D.font`.
 *
 * Variant A keys the measure cache on the resolved font string, so this
 * stays deterministic across re-renders of the same node.
 *
 * Output shape: `${style} ${weight} ${size}px/${lineHeight} ${family}`.
 * `style` and `weight` are omitted when they match defaults so the same
 * visual font produces the same key.
 */
export const fontFromStyle = (style: CSSStyleDeclaration): string => {
  const family = style.fontFamily || 'sans-serif';
  const size = style.fontSize || '16px';
  const weight = style.fontWeight || '400';
  const fontStyle = style.fontStyle || 'normal';
  const lineHeight =
    style.lineHeight && style.lineHeight !== 'normal'
      ? `/${style.lineHeight}`
      : '';

  const parts: string[] = [];

  if (fontStyle !== 'normal') parts.push(fontStyle);
  if (weight !== '400' && weight !== 'normal') parts.push(weight);
  parts.push(`${size}${lineHeight}`);
  parts.push(family);

  return parts.join(' ');
};
