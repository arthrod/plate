// lib/docx/style-map.ts:59
function addOrUpdateElement(elements, name, identifyingAttribute, attributes) {
  var existingElement = elements.find(
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
