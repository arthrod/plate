// lib/docx/office-xml-reader.ts:52
function readXmlFromZipFile(docxFile, path) {
  if (docxFile.exists(path)) {
    return docxFile.read(path, 'utf-8').then(stripUtf8Bom).then(read);
  }
  return promises.resolve(null);
}
