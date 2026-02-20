// Lines 4126-4134 in old_implementation.js
function elementsOfType(elementType, transform) {
  return elements((element) => {
    if (element.type === elementType) {
      return transform(element);
    }
    return element;
  });
}
