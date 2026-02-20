// lib/docx/docx-reader.ts:258
function readXmlFileWithBody(filename, options, func) {
  var readRelationshipsFromZipFile = xmlFileReader({
    filename: relationshipsFilename(filename),
    readElement: relationshipsReader.readRelationships,
    defaultValue: relationshipsReader.defaultValue,
  });

  return readRelationshipsFromZipFile(options.docxFile).then(
    (relationships) => {
      var bodyReader = new createBodyReader({
        relationships,
        contentTypes: options.contentTypes,
        docxFile: options.docxFile,
        numbering: options.numbering,
        styles: options.styles,
        files: options.files,
      });
      return readXmlFromZipFile(options.docxFile, filename).then((xml) =>
        func(bodyReader, xml)
      );
    }
  );
}
