// Lines 4135-4144 in old_implementation.js
function elements(transform) {
  return function transformElement(element) {
    if (element.children) {
      var children = _.map(element.children, transformElement);
      element = _.extend({}, element, { children });
    }
    return transform(element);
  };
}
