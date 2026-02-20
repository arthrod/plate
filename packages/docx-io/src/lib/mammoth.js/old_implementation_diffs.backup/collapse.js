// Lines 3006-3014 in old_implementation.js
function collapse(nodes) {
  var children = [];

  nodes.map(collapseNode).forEach((child) => {
    appendChild(children, child);
  });
  return children;
}
