// Found in: /schema.ts:242
// Lines 992-1040 in old_implementation.js
function BookmarkStart(options) {
  return {
    type: types.bookmarkStart,
    name: options.name,
  };
}

exports.document = exports.Document = Document;
exports.paragraph = exports.Paragraph = Paragraph;
exports.run = exports.Run = Run;
exports.text = exports.Text = Text;
exports.tab = exports.Tab = Tab;
exports.checkbox = exports.Checkbox = Checkbox;
exports.Hyperlink = Hyperlink;
exports.noteReference = exports.NoteReference = NoteReference;
exports.Notes = Notes;
exports.Note = Note;
exports.commentReference = commentReference;
exports.comment = comment;
exports.commentRangeStart = commentRangeStart;
exports.commentRangeEnd = commentRangeEnd;
exports.inserted = inserted;
exports.deleted = deleted;
exports.Image = Image;
exports.Table = Table;
exports.TableRow = TableRow;
exports.TableCell = TableCell;
exports.lineBreak = Break('line');
exports.pageBreak = Break('page');
exports.columnBreak = Break('column');
exports.BookmarkStart = BookmarkStart;

exports.verticalAlignment = verticalAlignment;

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":84,"underscore":104}],5:[function(require,module,exports){
exports.createBodyReader = createBodyReader;
exports._readNumberingProperties = readNumberingProperties;

var dingbatToUnicode = require('dingbat-to-unicode');
var _ = require('underscore');

var documents = require('../documents');
var Result = require('../results').Result;
var warning = require('../results').warning;
var xml = require('../xml');
var transforms = require('../transforms');
var uris = require('./uris');
