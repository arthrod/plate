// Lines 3986-3998 in old_implementation.js
function operatorStartsWith(first, second) {
  return second.toUpperCase().indexOf(first.toUpperCase()) === 0;
}

},{}],29:[function(require,module,exports){
var _ = require('underscore');

var html = require('../html');

exports.topLevelElement = topLevelElement;
exports.elements = elements;
exports.element = element;
