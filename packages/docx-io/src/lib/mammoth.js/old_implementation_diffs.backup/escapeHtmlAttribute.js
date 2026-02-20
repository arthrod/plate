// Lines 4332-4345 in old_implementation.js
function escapeHtmlAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

},{"underscore":104}],34:[function(require,module,exports){
var htmlWriter = require('./html-writer');
var markdownWriter = require('./markdown-writer');

exports.writer = writer;
