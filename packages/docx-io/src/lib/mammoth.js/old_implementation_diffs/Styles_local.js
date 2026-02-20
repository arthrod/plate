// lib/docx/styles-reader.ts:5
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
