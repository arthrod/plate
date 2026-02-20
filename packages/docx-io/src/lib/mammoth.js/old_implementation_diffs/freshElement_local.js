// Found in: /html/ast.ts:34
// Lines 2908-2912 in old_implementation.js
function freshElement(tagName, attributes, children) {
  var tag = htmlPaths.element(tagName, attributes, { fresh: true });
  return elementWithTag(tag, children);
}
