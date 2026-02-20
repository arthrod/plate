// Lines 3461-3477 in old_implementation.js
function isSameMessage(first, second) {
  return first.type === second.type && first.message === second.message;
}

},{"underscore":104}],27:[function(require,module,exports){
var _ = require('underscore');
var lop = require('lop');

var documentMatchers = require('./styles/document-matchers');
var htmlPaths = require('./styles/html-paths');
var tokenise = require('./styles/parser/tokeniser').tokenise;
var results = require('./results');

exports.readHtmlPath = readHtmlPath;
exports.readDocumentMatcher = readDocumentMatcher;
exports.readStyle = readStyle;
