// Lines 3033-3053 in old_implementation.js
function appendChild(children, child) {
  var lastChild = children[children.length - 1];
  if (
    child.type === 'element' &&
    !child.tag.fresh &&
    lastChild &&
    lastChild.type === 'element' &&
    child.tag.matchesElement(lastChild.tag)
  ) {
    if (child.tag.separator) {
      appendChild(lastChild.children, ast.text(child.tag.separator));
    }
    child.children.forEach((grandChild) => {
      // Mutation is fine since simplifying elements create a copy of the children.
      appendChild(lastChild.children, grandChild);
    });
  } else {
    children.push(child);
  }
}
