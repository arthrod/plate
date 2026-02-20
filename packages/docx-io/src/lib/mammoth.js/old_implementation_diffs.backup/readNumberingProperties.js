// Lines 1785-1837 in old_implementation.js
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

var supportedImageTypes = {
  'image/png': true,
  'image/gif': true,
  'image/jpeg': true,
  'image/svg+xml': true,
  'image/tiff': true,
};

var ignoreElements = {
  'office-word:wrap': true,
  'v:shadow': true,
  'v:shapetype': true,
  'w:annotationRef': true,
  'w:bookmarkEnd': true,
  'w:sectPr': true,
  'w:proofErr': true,
  'w:lastRenderedPageBreak': true,
  // w:commentRangeStart, w:commentRangeEnd are now handled by xmlElementReaders
  // w:del and w:ins are now handled by xmlElementReaders for tracked changes support
  'w:footnoteRef': true,
  'w:endnoteRef': true,
  'w:pPr': true,
  'w:rPr': true,
  'w:tblPr': true,
  'w:tblGrid': true,
  'w:trPr': true,
  'w:tcPr': true,
};
