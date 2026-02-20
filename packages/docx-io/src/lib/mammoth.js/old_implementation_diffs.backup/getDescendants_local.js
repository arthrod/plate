// lib/transforms.ts:41
function getDescendants(element) {
  var descendants = [];

  visitDescendants(element, (descendant) => {
    descendants.push(descendant);
  });

  return descendants;
}
