// Found in: /html/ast.ts:54
// Lines 2945-2964 in old_implementation.js
function isVoidElement(node) {
  return (
    (!node.children || node.children.length === 0) &&
    voidTagNames[node.tag.tagName]
  );
}

exports.isVoidElement = isVoidElement;

},{"../styles/html-paths":29}],19:[function(require,module,exports){
var ast = require('./ast');

exports.freshElement = ast.freshElement;
exports.nonFreshElement = ast.nonFreshElement;
exports.elementWithTag = ast.elementWithTag;
exports.text = ast.text;
exports.forceWrite = ast.forceWrite;

exports.simplify = require('./simplify');
