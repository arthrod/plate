// Found in: /options-reader.ts:1
// Lines 2620-2625 in old_implementation.js
function read(xmlString) {
  return xml
    .readString(xmlString, xmlNamespaceMap)
    .then((document) => collapseAlternateContent(document)[0]);
}
