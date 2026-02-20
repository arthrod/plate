// Found in: /index.ts:18
// Lines 3175-3178 in old_implementation.js
function readEmbeddedStyleMap(input) {
  return unzip.openZip(input).then(docxStyleMap.readStyleMap);
}
