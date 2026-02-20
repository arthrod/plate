// lib/documents.ts:55
function Run(children, properties) {
  properties = properties || {};
  return {
    type: types.run,
    children,
    styleId: properties.styleId || null,
    styleName: properties.styleName || null,
    isBold: !!properties.isBold,
    isUnderline: !!properties.isUnderline,
    isItalic: !!properties.isItalic,
    isStrikethrough: !!properties.isStrikethrough,
    isAllCaps: !!properties.isAllCaps,
    isSmallCaps: !!properties.isSmallCaps,
    verticalAlignment:
      properties.verticalAlignment || verticalAlignment.baseline,
    font: properties.font || null,
    fontSize: properties.fontSize || null,
    highlight: properties.highlight || null,
  };
}
