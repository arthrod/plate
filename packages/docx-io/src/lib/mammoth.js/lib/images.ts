// @ts-nocheck
var promises = require('./promises.ts');
var Html = require('./html/index.ts');

exports.imgElement = imgElement;

function imgElement(func) {
  return (element, messages) =>
    promises.when(func(element)).then((result) => {
      var attributes = {};
      if (element.altText) {
        attributes.alt = element.altText;
      }
      Object.assign(attributes, result);

      return [Html.freshElement('img', attributes)];
    });
}

// Undocumented, but retained for backwards-compatibility with 0.3.x
exports.inline = exports.imgElement;

exports.dataUri = imgElement((element) =>
  element.readAsBase64String().then((imageBuffer) => {
    var contentType = element.contentType || 'application/octet-stream';
    return {
      src: 'data:' + contentType + ';base64,' + imageBuffer,
    };
  })
);
