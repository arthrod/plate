// Found in: /docx/comments-reader.ts:53
// Lines 1950-2015 in old_implementation.js
function createCommentsReader(bodyReader, commentsExtended, dateUtcMap) {
  commentsExtended = commentsExtended || {};
  dateUtcMap = dateUtcMap || {};

  function readCommentsXml(element) {
    return Result.combine(
      element.getElementsByTagName('w:comment').map(readCommentElement)
    );
  }

  function readCommentElement(element) {
    var id = element.attributes['w:id'];

    function readOptionalAttribute(name) {
      return (element.attributes[name] || '').trim() || null;
    }

    return bodyReader.readXmlElements(element.children).map((body) => {
      var paraId = null;
      if (body) {
        for (var i = 0; i < body.length; i++) {
          if (body[i].paraId) {
            paraId = body[i].paraId;
            break;
          }
        }
      }
      var parentParaId = paraId ? commentsExtended[paraId] : null;

      // Prefer dateUtc (real UTC from commentsExtensible.xml) over
      // w:date (local time with fake Z, Word convention)
      var dateFromXml = readOptionalAttribute('w:date');
      var resolvedDate = (paraId && dateUtcMap[paraId]) || dateFromXml;

      return documents.comment({
        commentId: id,
        body,
        authorName: readOptionalAttribute('w:author'),
        authorInitials: readOptionalAttribute('w:initials'),
        date: resolvedDate,
        paraId,
        parentParaId,
      });
    });
  }

  return readCommentsXml;
}

exports.createCommentsReader = createCommentsReader;

},{"../documents":4,"../results":26}],8:[function(require,module,exports){
exports.readContentTypesFromXml = readContentTypesFromXml;

var fallbackContentTypes = {
  png: 'png',
  gif: 'gif',
  jpeg: 'jpeg',
  jpg: 'jpeg',
  tif: 'tiff',
  tiff: 'tiff',
  bmp: 'bmp',
};

exports.defaultContentTypes = contentTypes({}, {});
