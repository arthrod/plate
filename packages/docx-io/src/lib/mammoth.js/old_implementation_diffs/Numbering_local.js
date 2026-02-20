// Found in: /schema.ts:70
// Lines 2465-2500 in old_implementation.js
function Numbering(nums, abstractNums, styles) {
  var allLevels = _.flatten(
    _.values(abstractNums).map((abstractNum) => _.values(abstractNum.levels))
  );

  var levelsByParagraphStyleId = _.indexBy(
    allLevels.filter((level) => level.paragraphStyleId != null),
    'paragraphStyleId'
  );

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
