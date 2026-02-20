// lib/html/simplify.ts:16
function collapseNode(node) {
  return collapsers[node.type](node);
}
