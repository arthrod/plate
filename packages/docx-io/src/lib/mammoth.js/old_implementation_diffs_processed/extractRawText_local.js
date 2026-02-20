// Found in: /index.ts:13
// Lines 3199-3205 in old_implementation.js
function extractRawText(input) {
  return unzip
    .openZip(input)
    .then(docxReader.read)
    .then((documentResult) => documentResult.map(convertElementToRawText));
}
