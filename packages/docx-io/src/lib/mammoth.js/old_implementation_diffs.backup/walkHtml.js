// Lines 709-750 in old_implementation.js
function walkHtml(nodes, callback) {
  nodes.forEach((node) => {
    callback(node);
    if (node.children) {
      walkHtml(node.children, callback);
    }
  });
}

var commentAuthorLabel = (exports.commentAuthorLabel =
  function commentAuthorLabel(comment) {
    return comment.authorInitials || '';
  });

},{"./documents":4,"./html":19,"./images":21,"./promises":24,"./results":26,"./styles/html-paths":29,"./writers":34,"underscore":104}],4:[function(require,module,exports){
(function (Buffer){(function (){
var _ = require('underscore');

var types = (exports.types = {
  document: 'document',
  paragraph: 'paragraph',
  run: 'run',
  text: 'text',
  tab: 'tab',
  checkbox: 'checkbox',
  hyperlink: 'hyperlink',
  noteReference: 'noteReference',
  image: 'image',
  note: 'note',
  commentReference: 'commentReference',
  comment: 'comment',
  commentRangeStart: 'commentRangeStart',
  commentRangeEnd: 'commentRangeEnd',
  inserted: 'inserted',
  deleted: 'deleted',
  table: 'table',
  tableRow: 'tableRow',
  tableCell: 'tableCell',
  break: 'break',
  bookmarkStart: 'bookmarkStart',
});
