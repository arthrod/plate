// lib/docx/notes-reader.ts:7
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
