// Lines 3380-3400 in old_implementation.js
function convertElementToRawText(element) {
  if (element.type === 'text') {
    return element.value;
  }
  if (element.type === documents.types.tab) {
    return '\t';
  }
  var tail = element.type === 'paragraph' ? '\n\n' : '';
  return (element.children || []).map(convertElementToRawText).join('') + tail;
}

exports.convertElementToRawText = convertElementToRawText;

},{"./documents":4}],26:[function(require,module,exports){
var _ = require('underscore');

exports.Result = Result;
exports.success = success;
exports.warning = warning;
exports.error = error;
