// Lines 4581-4596 in old_implementation.js
function toElementList(array) {
  return _.extend(array, elementListPrototype);
}

},{"underscore":104}],38:[function(require,module,exports){
var promises = require('../promises');
var _ = require('underscore');

var xmldom = require('./xmldom');
var nodes = require('./nodes');
var Element = nodes.Element;

exports.readString = readString;

var Node = xmldom.Node;
