// lib/docx/numbering-xml.ts:70
function readAbstractNum(element) {
  var levels = {};

  // Some malformed documents define numbering levels without an index, and
  // reference the numbering using a w:numPr element without a w:ilvl child.
  // To handle such cases, we assume a level of 0 as a fallback.
  var levelWithoutIndex = null;

  element.getElementsByTagName('w:lvl').forEach((levelElement) => {
    var levelIndex = levelElement.attributes['w:ilvl'];
    var numFmt = levelElement.firstOrEmpty('w:numFmt').attributes['w:val'];
    var isOrdered = numFmt !== 'bullet';
    var paragraphStyleId =
      levelElement.firstOrEmpty('w:pStyle').attributes['w:val'];

    if (levelIndex === undefined) {
      levelWithoutIndex = {
        isOrdered,
        level: '0',
        paragraphStyleId,
      };
    } else {
      levels[levelIndex] = {
        isOrdered,
        level: levelIndex,
        paragraphStyleId,
      };
    }
  });

  if (
    levelWithoutIndex !== null &&
    levels[levelWithoutIndex.level] === undefined
  ) {
    levels[levelWithoutIndex.level] = levelWithoutIndex;
  }

  var numStyleLink = element.firstOrEmpty('w:numStyleLink').attributes['w:val'];

  return { levels, numStyleLink };
}
