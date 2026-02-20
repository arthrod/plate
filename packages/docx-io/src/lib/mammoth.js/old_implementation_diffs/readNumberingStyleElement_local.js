// lib/docx/styles-reader.ts:85
function readNumberingStyleElement(type, styleElement) {
  var styleId = readStyleId(styleElement);

  var numId = styleElement
    .firstOrEmpty('w:pPr')
    .firstOrEmpty('w:numPr')
    .firstOrEmpty('w:numId').attributes['w:val'];

  return { type, numId, styleId };
}
