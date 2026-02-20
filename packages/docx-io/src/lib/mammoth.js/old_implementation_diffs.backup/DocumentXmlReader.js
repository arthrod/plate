// Lines 2079-2126 in old_implementation.js
function DocumentXmlReader(options) {
  var bodyReader = options.bodyReader;

  function convertXmlToDocument(element) {
    var body = element.first('w:body');

    if (body == null) {
      throw new Error(
        'Could not find the body element: are you sure this is a docx file?'
      );
    }

    var result = bodyReader.readXmlElements(body.children).map(
      (children) =>
        new documents.Document(children, {
          notes: options.notes,
          comments: options.comments,
        })
    );
    return new Result(result.value, result.messages);
  }

  return {
    convertXmlToDocument,
  };
}

},{"../documents":4,"../results":26}],10:[function(require,module,exports){
exports.read = read;
exports._findPartPaths = findPartPaths;

var promises = require('../promises');
var documents = require('../documents');
var Result = require('../results').Result;
var zipfile = require('../zipfile');

var readXmlFromZipFile = require('./office-xml-reader').readXmlFromZipFile;
var createBodyReader = require('./body-reader').createBodyReader;
var DocumentXmlReader = require('./document-xml-reader').DocumentXmlReader;
var relationshipsReader = require('./relationships-reader');
var contentTypesReader = require('./content-types-reader');
var numberingXml = require('./numbering-xml');
var stylesReader = require('./styles-reader');
var notesReader = require('./notes-reader');
var commentsReader = require('./comments-reader');
var commentsExtendedReader = require('./comments-extended-reader');
var Files = require('./files').Files;
