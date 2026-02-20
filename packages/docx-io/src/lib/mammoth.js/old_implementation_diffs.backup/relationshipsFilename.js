// Lines 2383-2393 in old_implementation.js
function relationshipsFilename(filename) {
  var split = zipfile.splitPath(filename);
  return zipfile.joinPath(split.dirname, '_rels', split.basename + '.rels');
}

var readContentTypesFromZipFile = xmlFileReader({
  filename: '[Content_Types].xml',
  readElement: contentTypesReader.readContentTypesFromXml,
  defaultValue: contentTypesReader.defaultContentTypes,
});
