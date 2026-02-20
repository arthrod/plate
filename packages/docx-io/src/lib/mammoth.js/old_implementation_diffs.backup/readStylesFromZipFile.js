// Lines 2404-2424 in old_implementation.js
function readStylesFromZipFile(zipFile, path) {
  return xmlFileReader({
    filename: path,
    readElement: stylesReader.readStylesXml,
    defaultValue: stylesReader.defaultStyles,
  })(zipFile);
}

var readPackageRelationships = xmlFileReader({
  filename: '_rels/.rels',
  readElement: relationshipsReader.readRelationships,
  defaultValue: relationshipsReader.defaultValue,
});

},{"../documents":4,"../promises":24,"../results":26,"../zipfile":41,"./body-reader":5,"./comments-extended-reader":6,"./comments-reader":7,"./content-types-reader":8,"./document-xml-reader":9,"./files":1,"./notes-reader":11,"./numbering-xml":12,"./office-xml-reader":13,"./relationships-reader":14,"./styles-reader":16}],11:[function(require,module,exports){
var documents = require('../documents');
var Result = require('../results').Result;

exports.createFootnotesReader = createReader.bind(this, 'footnote');
exports.createEndnotesReader = createReader.bind(this, 'endnote');
