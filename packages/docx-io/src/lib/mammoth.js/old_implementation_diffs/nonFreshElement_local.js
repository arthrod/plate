// lib/html/ast.ts:3
function nonFreshElement(tagName, attributes, children) {
  return elementWithTag(
    htmlPaths.element(tagName, attributes, { fresh: false }),
    children
  );
}
