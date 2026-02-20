// Found in: /unzip.ts:6
// Lines 73-105 in old_implementation.js
function openZip(options) {
  if (options.arrayBuffer) {
    return promises.resolve(zipfile.openArrayBuffer(options.arrayBuffer));
  }
  return promises.reject(new Error('Could not find file in options'));
}

},{"../lib/promises":24,"../lib/zipfile":41}],3:[function(require,module,exports){
var _ = require('underscore');

var promises = require('./promises');
var documents = require('./documents');
var htmlPaths = require('./styles/html-paths');
var results = require('./results');
var images = require('./images');
var Html = require('./html');
var writers = require('./writers');

exports.DocumentConverter = DocumentConverter;

// Token prefixes for tracked changes - parsed by import-toolbar-button.tsx
var DOCX_INSERTION_START_TOKEN_PREFIX = '[[DOCX_INS_START:';
var DOCX_INSERTION_END_TOKEN_PREFIX = '[[DOCX_INS_END:';
var DOCX_INSERTION_TOKEN_SUFFIX = ']]';
var DOCX_DELETION_START_TOKEN_PREFIX = '[[DOCX_DEL_START:';
var DOCX_DELETION_END_TOKEN_PREFIX = '[[DOCX_DEL_END:';
var DOCX_DELETION_TOKEN_SUFFIX = ']]';

// Token prefixes for comment ranges - parsed by import-toolbar-button.tsx
var DOCX_COMMENT_START_TOKEN_PREFIX = '[[DOCX_CMT_START:';
var DOCX_COMMENT_END_TOKEN_PREFIX = '[[DOCX_CMT_END:';
var DOCX_COMMENT_TOKEN_SUFFIX = ']]';
