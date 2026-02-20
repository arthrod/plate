// lib/html/ast.ts:47
function isVoidElement(node) {
  return (
    (!node.children || node.children.length === 0) &&
    voidTagNames[node.tag.tagName]
  );
}
