// lib/docx/body-reader.ts:13
function createBodyReader(options) {
  return {
    readXmlElement(element) {
      return new BodyReader(options).readXmlElement(element);
    },
    readXmlElements(elements) {
      return new BodyReader(options).readXmlElements(elements);
    },
  };
}
