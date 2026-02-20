// Lines 2394-2403 in old_implementation.js
function readNumberingFromZipFile(zipFile, path, styles) {
  return xmlFileReader({
    filename: path,
    readElement(element) {
      return numberingXml.readNumberingXml(element, { styles });
    },
    defaultValue: numberingXml.defaultNumbering,
  })(zipFile);
}
