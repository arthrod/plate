// lib/html/ast.ts:10
function freshElement(tagName, attributes, children) {
  var tag = htmlPaths.element(tagName, attributes, { fresh: true });
  return elementWithTag(tag, children);
}
