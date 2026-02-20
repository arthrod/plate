// Found in: /docx/content-types-reader.ts:13
// Lines 2044-2078 in old_implementation.js
function contentTypes(overrides, extensionDefaults) {
  return {
    findContentType(path) {
      if (!path) return null;

      var overrideContentType = overrides[path];
      if (overrideContentType) {
        return overrideContentType;
      }
      var pathParts = path.split('.');
      var extension = pathParts[pathParts.length - 1];
      var extensionLower = extension.toLowerCase();
      if (
        Object.hasOwn(extensionDefaults, extension) ||
        Object.hasOwn(extensionDefaults, extensionLower)
      ) {
        return (
          extensionDefaults[extension] || extensionDefaults[extensionLower]
        );
      }
      var fallback = fallbackContentTypes[extensionLower];
      if (fallback) {
        return 'image/' + fallback;
      }
      return null;
    },
  };
}

},{}],9:[function(require,module,exports){
exports.DocumentXmlReader = DocumentXmlReader;

var documents = require('../documents');
var Result = require('../results').Result;
