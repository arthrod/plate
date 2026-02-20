// lib/index.ts:77
function extractRawText(input) {
  return withDone(
    unzip
    .openZip(input)
    .then(docxReader.read)
    .then((documentResult) => documentResult.map(convertElementToRawText))
  );
}
