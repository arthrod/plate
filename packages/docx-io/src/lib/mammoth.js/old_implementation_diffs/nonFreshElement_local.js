// Found in: /html/ast.ts:35
// Lines 2901-2907 in old_implementation.js
function nonFreshElement(tagName, attributes, children) {
  return elementWithTag(
    htmlPaths.element(tagName, attributes, { fresh: false }),
    children
  );
}
