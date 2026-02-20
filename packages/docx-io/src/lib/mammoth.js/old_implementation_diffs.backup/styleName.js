// Lines 2857-2861 in old_implementation.js
function styleName(styleElement) {
  var nameElement = styleElement.first('w:name');
  return nameElement ? nameElement.attributes['w:val'] : null;
}
