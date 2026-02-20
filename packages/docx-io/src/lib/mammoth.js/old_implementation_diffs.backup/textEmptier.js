// Lines 3080-3096 in old_implementation.js
function textEmptier(node) {
  if (node.value.length === 0) {
    return [];
  }
  return [node];
}

module.exports = simplify;

},{"./ast":18,"underscore":104}],21:[function(require,module,exports){
var _ = require('underscore');

var promises = require('./promises');
var Html = require('./html');

exports.imgElement = imgElement;
