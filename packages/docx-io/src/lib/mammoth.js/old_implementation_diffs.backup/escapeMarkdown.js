// Lines 4507-4542 in old_implementation.js
function escapeMarkdown(value) {
  return value.replace(/\\/g, '\\\\').replace(/([`*_{}[\]()#+\-.!])/g, '\\$1');
}

},{"underscore":104}],36:[function(require,module,exports){
var nodes = require('./nodes');

exports.Element = nodes.Element;
exports.element = nodes.element;
exports.emptyElement = nodes.emptyElement;
exports.text = nodes.text;
exports.readString = require('./reader').readString;
exports.writeString = require('./writer').writeString;

},{"./nodes":37,"./reader":38,"./writer":39}],37:[function(require,module,exports){
var _ = require('underscore');

exports.Element = Element;
exports.element = (name, attributes, children) =>
  new Element(name, attributes, children);
exports.text = (value) => ({
  type: 'text',
  value,
});

var emptyElement = (exports.emptyElement = {
  first() {
    return null;
  },
  firstOrEmpty() {
    return emptyElement;
  },
  attributes: {},
  children: [],
});
