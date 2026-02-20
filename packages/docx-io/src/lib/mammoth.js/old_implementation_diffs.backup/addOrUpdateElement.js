// Lines 2755-2769 in old_implementation.js
function addOrUpdateElement(elements, name, identifyingAttribute, attributes) {
  var existingElement = _.find(
    elements,
    (element) =>
      element.name === name &&
      element.attributes[identifyingAttribute] ===
        attributes[identifyingAttribute]
  );
  if (existingElement) {
    existingElement.attributes = attributes;
  } else {
    elements.push(xml.element(name, attributes));
  }
}
