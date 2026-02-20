// Found in: /docx/files.ts:10
// Lines 51-72 in old_implementation.js
function Files() {
  function read(uri) {
    return promises.reject(
      new Error(
        "could not open external image: '" +
          uri +
          "'\ncannot open linked files from a web browser"
      )
    );
  }

  return {
    read,
  };
}

},{"../../lib/promises":24}],2:[function(require,module,exports){
var promises = require('../lib/promises');
var zipfile = require('../lib/zipfile');

exports.openZip = openZip;
