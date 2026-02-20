// Found in: /xml/xmldom.ts:22
// Lines 4730-4758 in old_implementation.js
function parseFromString(string) {
  var errors = [];

  var domParser = new xmldom.DOMParser({
    errorHandler(level, message) {
      errors.push({ level, message });
    },
  });

  var document = domParser.parseFromString(string);

  if (errors.length === 0) {
    return document;
  }
  var errorMessages = errors.map((e) => e.level + ': ' + e.message).join('\n');
  throw new Error(errorMessages);
}

exports.parseFromString = parseFromString;
exports.Node = dom.Node;

},{"@xmldom/xmldom":46,"@xmldom/xmldom/lib/dom":44}],41:[function(require,module,exports){
var base64js = require('base64-js');
var JSZip = require('jszip');

exports.openArrayBuffer = openArrayBuffer;
exports.splitPath = splitPath;
exports.joinPath = joinPath;
