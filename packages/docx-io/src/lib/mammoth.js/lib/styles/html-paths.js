var html = require('../html');

exports.topLevelElement = topLevelElement;
exports.elements = elements;
exports.element = element;

function topLevelElement(tagName, attributes) {
  return elements([element(tagName, attributes, { fresh: true })]);
}

function elements(elementStyles) {
  return new HtmlPath(
    elementStyles.map((elementStyle) => {
      if (typeof elementStyle === 'string') {
        return element(elementStyle);
      }
      return elementStyle;
    })
  );
}

function HtmlPath(elements) {
  this._elements = elements;
}

HtmlPath.prototype.wrap = function wrap(children) {
  var result = children();
  for (var index = this._elements.length - 1; index >= 0; index--) {
    result = this._elements[index].wrapNodes(result);
  }
  return result;
};

function element(tagName, attributes, options) {
  options = options || {};
  return new Element(tagName, attributes, options);
}

function Element(tagName, attributes, options) {
  var tagNames = {};
  if (Array.isArray(tagName)) {
    tagName.forEach((tagName) => {
      tagNames[tagName] = true;
    });
    tagName = tagName[0];
  } else {
    tagNames[tagName] = true;
  }

  this.tagName = tagName;
  this.tagNames = tagNames;
  this.attributes = attributes || {};
  this.fresh = options.fresh;
  this.separator = options.separator;
}

Element.prototype.matchesElement = function (element) {
  return (
    this.tagNames[element.tagName] &&
    areEqualAttributes(this.attributes || {}, element.attributes || {})
  );
};

Element.prototype.wrap = function wrap(generateNodes) {
  return this.wrapNodes(generateNodes());
};

Element.prototype.wrapNodes = function wrapNodes(nodes) {
  return [html.elementWithTag(this, nodes)];
};

exports.empty = elements([]);
exports.ignore = {
  wrap() {
    return [];
  },
};

function areEqualAttributes(first, second) {
  var firstKeys = Object.keys(first);
  var secondKeys = Object.keys(second);

  if (firstKeys.length !== secondKeys.length) {
    return false;
  }

  return firstKeys.every((key) => first[key] === second[key]);
}
