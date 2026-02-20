// lib/html/simplify.ts:55
function removeEmpty(nodes) {
  return flatMap(nodes, (node) => emptiers[node.type](node));
}
