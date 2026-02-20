// lib/docx/style-map.ts:40
function updateContentTypes(docxFile) {
  var path = '[Content_Types].xml';
  var contentTypesUri =
    'http://schemas.openxmlformats.org/package/2006/content-types';
  var overrideName = '{' + contentTypesUri + '}Override';
  return docxFile
    .read(path, 'utf8')
    .then(xml.readString)
    .then((typesElement) => {
      var children = typesElement.children;
      addOrUpdateElement(children, overrideName, 'PartName', {
        PartName: styleMapAbsolutePath,
        ContentType: 'text/prs.mammoth.style-map',
      });
      var namespaces = { '': contentTypesUri };
      return docxFile.write(path, xml.writeString(typesElement, namespaces));
    });
}
