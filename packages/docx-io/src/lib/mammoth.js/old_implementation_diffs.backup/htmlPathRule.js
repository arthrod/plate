// Lines 3712-3804 in old_implementation.js
function htmlPathRule() {
  var capture = lop.rules.sequence.capture;
  var whitespaceRule = lop.rules.tokenOfType('whitespace');
  var freshRule = lop.rules.then(
    lop.rules.optional(
      lop.rules.sequence(
        lop.rules.tokenOfType('colon'),
        lop.rules.token('identifier', 'fresh')
      )
    ),
    (option) => option.map(() => true).valueOrElse(false)
  );

  var separatorRule = lop.rules.then(
    lop.rules.optional(
      lop.rules
        .sequence(
          lop.rules.tokenOfType('colon'),
          lop.rules.token('identifier', 'separator'),
          lop.rules.tokenOfType('open-paren'),
          capture(stringRule),
          lop.rules.tokenOfType('close-paren')
        )
        .head()
    ),
    (option) => option.valueOrElse('')
  );

  var tagNamesRule = lop.rules.oneOrMoreWithSeparator(
    identifierRule,
    lop.rules.tokenOfType('choice')
  );

  var styleElementRule = lop.rules
    .sequence(
      capture(tagNamesRule),
      capture(lop.rules.zeroOrMore(attributeOrClassRule)),
      capture(freshRule),
      capture(separatorRule)
    )
    .map((tagName, attributesList, fresh, separator) => {
      var attributes = {};
      var options = {};
      attributesList.forEach((attribute) => {
        if (attribute.append && attributes[attribute.name]) {
          attributes[attribute.name] += ' ' + attribute.value;
        } else {
          attributes[attribute.name] = attribute.value;
        }
      });
      if (fresh) {
        options.fresh = true;
      }
      if (separator) {
        options.separator = separator;
      }
      return htmlPaths.element(tagName, attributes, options);
    });

  return lop.rules.firstOf(
    'html path',
    lop.rules.then(lop.rules.tokenOfType('bang'), () => htmlPaths.ignore),
    lop.rules.then(
      lop.rules.zeroOrMoreWithSeparator(
        styleElementRule,
        lop.rules.sequence(
          whitespaceRule,
          lop.rules.tokenOfType('gt'),
          whitespaceRule
        )
      ),
      htmlPaths.elements
    )
  );
}

var identifierRule = lop.rules.then(
  lop.rules.tokenOfType('identifier'),
  decodeEscapeSequences
);
var integerRule = lop.rules.tokenOfType('integer');

var stringRule = lop.rules.then(
  lop.rules.tokenOfType('string'),
  decodeEscapeSequences
);

var escapeSequences = {
  n: '\n',
  r: '\r',
  t: '\t',
};
