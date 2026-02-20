// Lines 4031-4078 in old_implementation.js
function Element(tagName, attributes, options) {
  var tagNames = {};
  if (_.isArray(tagName)) {
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
    _.isEqual(this.attributes || {}, element.attributes || {})
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

},{"../html":19,"underscore":104}],30:[function(require,module,exports){
var lop = require('lop');
var RegexTokeniser = lop.RegexTokeniser;

exports.tokenise = tokenise;

var stringPrefix = "'((?:\\\\.|[^'])*)";
