// Found in: /docx/uris.ts:2
// Lines 2890-2900 in old_implementation.js
function replaceFragment(uri, fragment) {
  var hashIndex = uri.indexOf('#');
  if (hashIndex !== -1) {
    uri = uri.substring(0, hashIndex);
  }
  return uri + '#' + fragment;
}

},{}],18:[function(require,module,exports){
var htmlPaths = require('../styles/html-paths');
