// lib/html/simplify.ts:26
function collapseElement(node) {
  return ast.elementWithTag(node.tag, collapse(node.children));
}
