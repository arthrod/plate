var promises = require('../promises.ts');

var xmldom = require('./xmldom.ts');
var nodes = require('./nodes.ts');
var Element = nodes.Element;
var xmlNamespaceUri = 'http://www.w3.org/2000/xmlns/';

exports.readString = readString;

var Node = xmldom.Node;

function readString(xmlString, namespaceMap) {
  namespaceMap = namespaceMap || {};

  try {
    var document = xmldom.parseFromString(xmlString, 'text/xml');
  } catch (error) {
    return promises.reject(error);
  }

  if (document.documentElement.tagName === 'parsererror') {
    return promises.reject(new Error(document.documentElement.textContent));
  }

  function convertNode(node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        return convertElement(node);
      case Node.TEXT_NODE:
        return nodes.text(node.nodeValue);
    }
  }

  function convertElement(element) {
    var convertedName = convertName(element);

    var convertedChildren = [];
    Array.prototype.forEach.call(element.childNodes, (childNode) => {
      var convertedNode = convertNode(childNode);
      if (convertedNode) {
        convertedChildren.push(convertedNode);
      }
    });

    var convertedAttributes = {};
    Array.prototype.forEach.call(element.attributes, (attribute) => {
      if (attribute.namespaceURI === xmlNamespaceUri) {
        return;
      }
      convertedAttributes[convertName(attribute)] = attribute.value;
    });

    return new Element(convertedName, convertedAttributes, convertedChildren);
  }

  function convertName(node) {
    if (node.namespaceURI) {
      var mappedPrefix = namespaceMap[node.namespaceURI];
      var prefix;
      if (mappedPrefix) {
        prefix = mappedPrefix + ':';
      } else {
        prefix = '{' + node.namespaceURI + '}';
      }
      return prefix + node.localName;
    }
    return node.localName;
  }

  return promises.resolve(convertNode(document.documentElement));
}
