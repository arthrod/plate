// Found in: /docx/body-reader.ts:1
// Lines 1041-1051 in old_implementation.js
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
