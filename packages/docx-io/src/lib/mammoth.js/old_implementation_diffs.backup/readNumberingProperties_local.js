// lib/docx/body-reader.ts:736
function readNumberingProperties(styleId, element, numbering) {
  var level = element.firstOrEmpty('w:ilvl').attributes['w:val'];
  var numId = element.firstOrEmpty('w:numId').attributes['w:val'];
  if (level !== undefined && numId !== undefined) {
    return numbering.findLevel(numId, level);
  }

  if (styleId != null) {
    var levelByStyleId = numbering.findLevelByParagraphStyleId(styleId);
    if (levelByStyleId != null) {
      return levelByStyleId;
    }
  }

  // Some malformed documents define numbering levels without an index, and
  // reference the numbering using a w:numPr element without a w:ilvl child.
  // To handle such cases, we assume a level of 0 as a fallback.
  if (numId !== undefined) {
    return numbering.findLevel(numId, '0');
  }

  return null;
}
