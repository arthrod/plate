// Lines 2770-2781 in old_implementation.js
function readStyleMap(docxFile) {
  if (docxFile.exists(styleMapPath)) {
    return docxFile.read(styleMapPath, 'utf8');
  }
  return promises.resolve(null);
}

},{"../promises":24,"../xml":36,"underscore":104}],16:[function(require,module,exports){
exports.readStylesXml = readStylesXml;
exports.Styles = Styles;
exports.defaultStyles = new Styles({}, {}, {}, {});
