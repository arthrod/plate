// Lines 3015-3024 in old_implementation.js
function collapseNode(node) {
  return collapsers[node.type](node);
}

var collapsers = {
  element: collapseElement,
  text: identity,
  forceWrite: identity,
};
