// Found in: /styles/parser/tokeniser.ts:4
// Lines 4079-4117 in old_implementation.js
function tokenise(string) {
  var identifierCharacter = '(?:[a-zA-Z\\-_]|\\\\.)';
  var tokeniser = new RegexTokeniser([
    {
      name: 'identifier',
      regex: new RegExp(
        '(' + identifierCharacter + '(?:' + identifierCharacter + '|[0-9])*)'
      ),
    },
    { name: 'dot', regex: /\./ },
    { name: 'colon', regex: /:/ },
    { name: 'gt', regex: />/ },
    { name: 'whitespace', regex: /\s+/ },
    { name: 'arrow', regex: /=>/ },
    { name: 'equals', regex: /=/ },
    { name: 'startsWith', regex: /\^=/ },
    { name: 'open-paren', regex: /\(/ },
    { name: 'close-paren', regex: /\)/ },
    { name: 'open-square-bracket', regex: /\[/ },
    { name: 'close-square-bracket', regex: /\]/ },
    { name: 'string', regex: new RegExp(stringPrefix + "'") },
    { name: 'unterminated-string', regex: new RegExp(stringPrefix) },
    { name: 'integer', regex: /([0-9]+)/ },
    { name: 'choice', regex: /\|/ },
    { name: 'bang', regex: /(!)/ },
  ]);
  return tokeniser.tokenise(string);
}

},{"lop":90}],31:[function(require,module,exports){
var _ = require('underscore');

exports.paragraph = paragraph;
exports.run = run;
exports._elements = elements;
exports._elementsOfType = elementsOfType;
exports.getDescendantsOfType = getDescendantsOfType;
exports.getDescendants = getDescendants;
