// lib/docx/styles-reader.ts:80
function styleName(styleElement) {
  var nameElement = styleElement.first('w:name');
  return nameElement ? nameElement.attributes['w:val'] : null;
}
