// lib/transforms.ts:35
function getDescendantsOfType(element, type) {
  return getDescendants(element).filter(
    (descendant) => descendant.type === type
  );
}
