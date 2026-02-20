// Found in: /docx/content-types-reader.ts:1
// Lines 2016-2043 in old_implementation.js
function readContentTypesFromXml(element) {
  var extensionDefaults = {};
  var overrides = {};

  if (!element || !element.children) {
    return contentTypes(overrides, extensionDefaults);
  }

  element.children.forEach((child) => {
    if (!child || !child.attributes) return;

    if (child.name === 'content-types:Default') {
      extensionDefaults[child.attributes.Extension] =
        child.attributes.ContentType;
    }
    if (child.name === 'content-types:Override') {
      var name = child.attributes.PartName;
      if (name && name.charAt(0) === '/') {
        name = name.substring(1);
      }
      if (name) {
        overrides[name] = child.attributes.ContentType;
      }
    }
  });
  return contentTypes(overrides, extensionDefaults);
}
