// Lines 3097-3144 in old_implementation.js
function imgElement(func) {
  return (element, messages) =>
    promises.when(func(element)).then((result) => {
      var attributes = {};
      if (element.altText) {
        attributes.alt = element.altText;
      }
      _.extend(attributes, result);

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

},{"./html":19,"./promises":24,"underscore":104}],22:[function(require,module,exports){
(function (Buffer){(function (){
var _ = require('underscore');

var docxReader = require('./docx/docx-reader');
var docxStyleMap = require('./docx/style-map');
var DocumentConverter = require('./document-to-html').DocumentConverter;
var convertElementToRawText = require('./raw-text').convertElementToRawText;
var readStyle = require('./style-reader').readStyle;
var readOptions = require('./options-reader').readOptions;
var unzip = require('./unzip');
var Result = require('./results').Result;

exports.convertToHtml = convertToHtml;
exports.convertToMarkdown = convertToMarkdown;
exports.convert = convert;
exports.extractRawText = extractRawText;
exports.images = require('./images');
exports.transforms = require('./transforms');
exports.underline = require('./underline');
exports.embedStyleMap = embedStyleMap;
exports.readEmbeddedStyleMap = readEmbeddedStyleMap;
