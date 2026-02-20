// lib/docx/docx-reader.ts:303
function readStylesFromZipFile(zipFile, path) {
  return xmlFileReader({
    filename: path,
    readElement: stylesReader.readStylesXml,
    defaultValue: stylesReader.defaultStyles,
  })(zipFile);
}
