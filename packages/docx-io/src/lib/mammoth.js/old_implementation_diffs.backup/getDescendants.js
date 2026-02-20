// Lines 4151-4160 in old_implementation.js
function getDescendants(element) {
  var descendants = [];

  visitDescendants(element, (descendant) => {
    descendants.push(descendant);
  });

  return descendants;
}
