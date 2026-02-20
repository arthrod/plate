// lib/docx/style-map.ts:16
function updateRelationships(docxFile) {
  var path = 'word/_rels/document.xml.rels';
  var relationshipsUri =
    'http://schemas.openxmlformats.org/package/2006/relationships';
  var relationshipElementName = '{' + relationshipsUri + '}Relationship';
  return docxFile
    .read(path, 'utf8')
    .then(xml.readString)
    .then((relationshipsContainer) => {
      var relationships = relationshipsContainer.children;
      addOrUpdateElement(relationships, relationshipElementName, 'Id', {
        Id: 'rMammothStyleMap',
        Type: schema,
        Target: styleMapAbsolutePath,
      });

      var namespaces = { '': relationshipsUri };
      return docxFile.write(
        path,
        xml.writeString(relationshipsContainer, namespaces)
      );
    });
}
