// lib/index.ts:30
function convert(input, options) {
  options = readOptions(options);

  return withDone(
    unzip
    .openZip(input)
    .then((docxFile) =>
      docxStyleMap.readStyleMap(docxFile).then((styleMap) => {
        options.embeddedStyleMap = styleMap;
        return docxFile;
      })
    )
    .then((docxFile) =>
      docxReader
        .read(docxFile, input, options)
        .then((documentResult) => documentResult.map(options.transformDocument))
        .then((documentResult) =>
          convertDocumentToHtml(documentResult, options)
        )
    )
  );
}
