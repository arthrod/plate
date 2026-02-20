// lib/docx/office-xml-reader.ts:59
function stripUtf8Bom(xmlString) {
  return xmlString.replace(/^\uFEFF/g, '');
}
