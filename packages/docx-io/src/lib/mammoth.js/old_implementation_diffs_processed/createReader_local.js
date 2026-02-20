// Found in: /docx/notes-reader.ts:4
// Lines 2425-2464 in old_implementation.js
function createReader(noteType, bodyReader) {
  function readNotesXml(element) {
    return Result.combine(
      element
        .getElementsByTagName('w:' + noteType)
        .filter(isFootnoteElement)
        .map(readFootnoteElement)
    );
  }

  function isFootnoteElement(element) {
    var type = element.attributes['w:type'];
    return type !== 'continuationSeparator' && type !== 'separator';
  }

  function readFootnoteElement(footnoteElement) {
    var id = footnoteElement.attributes['w:id'];
    return bodyReader
      .readXmlElements(footnoteElement.children)
      .map((body) => documents.Note({ noteType, noteId: id, body }));
  }

  return readNotesXml;
}

},{"../documents":4,"../results":26}],12:[function(require,module,exports){
var _ = require('underscore');

exports.readNumberingXml = readNumberingXml;
exports.Numbering = Numbering;
exports.defaultNumbering = new Numbering(
  {},
  {},
  {
    findNumberingStyleById() {
      return null;
    },
  }
);
