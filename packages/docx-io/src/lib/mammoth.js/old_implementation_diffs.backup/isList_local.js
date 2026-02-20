// lib/styles/document-matchers.ts:88
function isList(element, levelIndex, isOrdered) {
  return (
    element.numbering &&
    element.numbering.level == levelIndex &&
    element.numbering.isOrdered == isOrdered
  );
}
