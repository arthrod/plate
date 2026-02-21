// @ts-nocheck
exports.paragraph = paragraph;
exports.run = run;
exports._elements = elements;
exports._elementsOfType = elementsOfType;
exports.getDescendantsOfType = getDescendantsOfType;
exports.getDescendants = getDescendants;

function paragraph(transform) {
  return elementsOfType('paragraph', transform);
}

function run(transform) {
  return elementsOfType('run', transform);
}

function elementsOfType(elementType, transform) {
  return elements((element) => {
    if (element.type === elementType) {
      return transform(element);
    }
    return element;
  });
}

function elements(transform) {
  return function transformElement(element) {
    if (element.children) {
      var children = element.children.map(transformElement);
      element = Object.assign({}, element, { children });
    }
    return transform(element);
  };
}

function getDescendantsOfType(element, type) {
  return getDescendants(element).filter(
    (descendant) => descendant.type === type
  );
}

function getDescendants(element) {
  var descendants = [];

  visitDescendants(element, (descendant) => {
    descendants.push(descendant);
  });

  return descendants;
}

function visitDescendants(element, visit) {
  if (element.children) {
    element.children.forEach((child) => {
      visitDescendants(child, visit);
      visit(child);
    });
  }
}
