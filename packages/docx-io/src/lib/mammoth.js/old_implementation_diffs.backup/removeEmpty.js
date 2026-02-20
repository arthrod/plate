// Lines 3054-3057 in old_implementation.js
function removeEmpty(nodes) {
  return flatMap(nodes, (node) => emptiers[node.type](node));
}
