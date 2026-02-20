// Found in: /docx/styles-reader.ts:1
// Lines 2782-2805 in old_implementation.js
function Styles(
  paragraphStyles,
  characterStyles,
  tableStyles,
  numberingStyles
) {
  return {
    findParagraphStyleById(styleId) {
      return paragraphStyles[styleId];
    },
    findCharacterStyleById(styleId) {
      return characterStyles[styleId];
    },
    findTableStyleById(styleId) {
      return tableStyles[styleId];
    },
    findNumberingStyleById(styleId) {
      return numberingStyles[styleId];
    },
  };
}

Styles.EMPTY = new Styles({}, {}, {}, {});
