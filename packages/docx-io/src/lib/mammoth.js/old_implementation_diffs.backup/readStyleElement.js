// Lines 2846-2856 in old_implementation.js
function readStyleElement(styleElement) {
  var type = styleElement.attributes['w:type'];

  if (type === 'numbering') {
    return readNumberingStyleElement(type, styleElement);
  }
  var styleId = readStyleId(styleElement);
  var name = styleName(styleElement);
  return { type, styleId, name };
}
