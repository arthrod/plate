// Found in: /docx/office-xml-reader.ts:5
// Lines 2626-2632 in old_implementation.js
function readXmlFromZipFile(docxFile, path) {
  if (docxFile.exists(path)) {
    return docxFile.read(path, 'utf-8').then(stripUtf8Bom).then(read);
  }
  return promises.resolve(null);
}
