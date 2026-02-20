// Lines 3805-3836 in old_implementation.js
function decodeEscapeSequences(value) {
  return value.replace(
    /\\(.)/g,
    (match, code) => escapeSequences[code] || code
  );
}

var attributeRule = lop.rules
  .sequence(
    lop.rules.tokenOfType('open-square-bracket'),
    lop.rules.sequence.cut(),
    lop.rules.sequence.capture(identifierRule),
    lop.rules.tokenOfType('equals'),
    lop.rules.sequence.capture(stringRule),
    lop.rules.tokenOfType('close-square-bracket')
  )
  .map((name, value) => ({ name, value, append: false }));

var classRule = lop.rules
  .sequence(
    lop.rules.tokenOfType('dot'),
    lop.rules.sequence.cut(),
    lop.rules.sequence.capture(identifierRule)
  )
  .map((className) => ({ name: 'class', value: className, append: true }));

var attributeOrClassRule = lop.rules.firstOf(
  'attribute or class',
  attributeRule,
  classRule
);
