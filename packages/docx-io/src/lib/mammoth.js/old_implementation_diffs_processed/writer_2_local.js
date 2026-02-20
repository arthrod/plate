// Found in: /writers/markdown-writer.ts:149
// Lines 4346-4356 in old_implementation.js
function writer(options) {
  options = options || {};
  if (options.outputFormat === 'markdown') {
    return markdownWriter.writer();
  }
  return htmlWriter.writer(options);
}

},{"./html-writer":33,"./markdown-writer":35}],35:[function(require,module,exports){
var _ = require('underscore');
