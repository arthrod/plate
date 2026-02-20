// lib/html/simplify.ts:7
function collapse(nodes) {
  var children = [];

  nodes.map(collapseNode).forEach((child) => {
    appendChild(children, child);
  });
  return children;
}
