// lib/html/simplify.ts:73
function elementEmptier(element) {
  var children = removeEmpty(element.children);
  if (children.length === 0 && !ast.isVoidElement(element)) {
    return [];
  }
  return [ast.elementWithTag(element.tag, children)];
}
