// Lines 3960-3967 in old_implementation.js
function isList(element, levelIndex, isOrdered) {
  return (
    element.numbering &&
    element.numbering.level === levelIndex &&
    element.numbering.isOrdered === isOrdered
  );
}
