// Lines 2991-3001 in old_implementation.js
function generateTextString(writer, node) {
  writer.text(node.value);
}

exports.write = write;

},{"./ast":18,"./simplify":20}],20:[function(require,module,exports){
var _ = require('underscore');

var ast = require('./ast');
