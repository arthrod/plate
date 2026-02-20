// lib/transforms.ts:25
function elements(transform) {
  return function transformElement(element) {
    if (element.children) {
      var children = element.children.map(transformElement);
      element = Object.assign({}, element, { children });
    }
    return transform(element);
  };
}
