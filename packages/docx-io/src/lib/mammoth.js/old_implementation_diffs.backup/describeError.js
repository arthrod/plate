// Lines 3858-3893 in old_implementation.js
function describeError(error) {
  return (
    'Error was at character number ' +
    error.characterNumber() +
    ': ' +
    'Expected ' +
    error.expected +
    ' but got ' +
    error.actual
  );
}

var styleRule = createStyleRule();

},{"./results":26,"./styles/document-matchers":28,"./styles/html-paths":29,"./styles/parser/tokeniser":30,"lop":90,"underscore":104}],28:[function(require,module,exports){
exports.paragraph = paragraph;
exports.run = run;
exports.table = table;
exports.bold = new Matcher('bold');
exports.italic = new Matcher('italic');
exports.underline = new Matcher('underline');
exports.strikethrough = new Matcher('strikethrough');
exports.allCaps = new Matcher('allCaps');
exports.smallCaps = new Matcher('smallCaps');
exports.highlight = highlight;
exports.commentReference = new Matcher('commentReference');
exports.commentRangeStart = new Matcher('commentRangeStart');
exports.commentRangeEnd = new Matcher('commentRangeEnd');
exports.inserted = new Matcher('inserted');
exports.deleted = new Matcher('deleted');
exports.lineBreak = new BreakMatcher({ breakType: 'line' });
exports.pageBreak = new BreakMatcher({ breakType: 'page' });
exports.columnBreak = new BreakMatcher({ breakType: 'column' });
exports.equalTo = equalTo;
exports.startsWith = startsWith;
