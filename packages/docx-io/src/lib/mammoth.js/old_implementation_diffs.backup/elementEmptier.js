// Lines 3072-3079 in old_implementation.js
function elementEmptier(element) {
  var children = removeEmpty(element.children);
  if (children.length === 0 && !ast.isVoidElement(element)) {
    return [];
  }
  return [ast.elementWithTag(element.tag, children)];
}
