// Lines 2633-2636 in old_implementation.js
function stripUtf8Bom(xmlString) {
  return xmlString.replace(/^\uFEFF/g, '');
}
