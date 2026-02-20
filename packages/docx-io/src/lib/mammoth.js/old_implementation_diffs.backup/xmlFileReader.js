// Lines 2352-2358 in old_implementation.js
function xmlFileReader(options) {
  return (zipFile) =>
    readXmlFromZipFile(zipFile, options.filename).then((element) =>
      element ? options.readElement(element) : options.defaultValue
    );
}
