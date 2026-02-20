// Lines 3155-3174 in old_implementation.js
function convert(input, options) {
  options = readOptions(options);

  return unzip
    .openZip(input)
    .tap((docxFile) =>
      docxStyleMap.readStyleMap(docxFile).then((styleMap) => {
        options.embeddedStyleMap = styleMap;
      })
    )
    .then((docxFile) =>
      docxReader
        .read(docxFile, input, options)
        .then((documentResult) => documentResult.map(options.transformDocument))
        .then((documentResult) =>
          convertDocumentToHtml(documentResult, options)
        )
    );
}
