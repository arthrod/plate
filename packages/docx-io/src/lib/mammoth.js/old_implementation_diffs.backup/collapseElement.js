// Lines 3025-3028 in old_implementation.js
function collapseElement(node) {
  return ast.elementWithTag(node.tag, collapse(node.children));
}
