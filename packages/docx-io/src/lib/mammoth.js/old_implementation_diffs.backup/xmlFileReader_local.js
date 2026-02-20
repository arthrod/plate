// lib/docx/docx-reader.ts:251
function xmlFileReader(options) {
  return (zipFile) =>
    readXmlFromZipFile(zipFile, options.filename).then((element) =>
      element ? options.readElement(element) : options.defaultValue
    );
}
