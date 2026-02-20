// Lines 4145-4150 in old_implementation.js
function getDescendantsOfType(element, type) {
  return getDescendants(element).filter(
    (descendant) => descendant.type === type
  );
}
