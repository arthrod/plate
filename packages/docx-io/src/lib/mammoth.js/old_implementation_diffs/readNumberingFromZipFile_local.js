// lib/docx/docx-reader.ts:293
function readNumberingFromZipFile(zipFile, path, styles) {
  return xmlFileReader({
    filename: path,
    readElement(element) {
      return numberingXml.readNumberingXml(element, { styles });
    },
    defaultValue: numberingXml.defaultNumbering,
  })(zipFile);
}
