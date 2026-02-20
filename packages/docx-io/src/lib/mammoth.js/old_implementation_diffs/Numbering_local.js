// lib/docx/numbering-xml.ts:13
function Numbering(nums, abstractNums, styles) {
  var allLevels = Object.values(abstractNums).flatMap((abstractNum) =>
    Object.values(abstractNum.levels)
  );

  var levelsByParagraphStyleId = allLevels
    .filter((level) => level.paragraphStyleId != null)
    .reduce((indexedLevels, level) => {
      indexedLevels[level.paragraphStyleId] = level;
      return indexedLevels;
    }, {});

  function findLevel(numId, level) {
    var num = nums[numId];
    if (num) {
      var abstractNum = abstractNums[num.abstractNumId];
      if (!abstractNum) {
        return null;
      }
      if (abstractNum.numStyleLink == null) {
        return abstractNums[num.abstractNumId].levels[level];
      }
      var style = styles.findNumberingStyleById(abstractNum.numStyleLink);
      return findLevel(style.numId, level);
    }
    return null;
  }

  function findLevelByParagraphStyleId(styleId) {
    return levelsByParagraphStyleId[styleId] || null;
  }

  return {
    findLevel,
    findLevelByParagraphStyleId,
  };
}
