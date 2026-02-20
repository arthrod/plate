// lib/transforms.ts:51
function visitDescendants(element, visit) {
  if (element.children) {
    element.children.forEach((child) => {
      visitDescendants(child, visit);
      visit(child);
    });
  }
}
