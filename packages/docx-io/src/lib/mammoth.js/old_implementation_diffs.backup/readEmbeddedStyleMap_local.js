// lib/index.ts:53
function readEmbeddedStyleMap(input) {
  return withDone(unzip.openZip(input).then(docxStyleMap.readStyleMap));
}
