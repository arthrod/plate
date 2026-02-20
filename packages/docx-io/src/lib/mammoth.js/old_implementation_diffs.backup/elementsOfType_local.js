// lib/transforms.ts:16
function elementsOfType(elementType, transform) {
  return elements((element) => {
    if (element.type === elementType) {
      return transform(element);
    }
    return element;
  });
}
