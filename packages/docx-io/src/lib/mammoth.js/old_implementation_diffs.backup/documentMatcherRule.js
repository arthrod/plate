// Lines 3510-3707 in old_implementation.js
function documentMatcherRule() {
  var sequence = lop.rules.sequence;

  var identifierToConstant = (identifier, constant) =>
    lop.rules.then(lop.rules.token('identifier', identifier), () => constant);

  var paragraphRule = identifierToConstant('p', documentMatchers.paragraph);
  var runRule = identifierToConstant('r', documentMatchers.run);

  var elementTypeRule = lop.rules.firstOf(
    'p or r or table',
    paragraphRule,
    runRule
  );

  var styleIdRule = lop.rules
    .sequence(
      lop.rules.tokenOfType('dot'),
      lop.rules.sequence.cut(),
      lop.rules.sequence.capture(identifierRule)
    )
    .map((styleId) => ({ styleId }));

  var styleNameMatcherRule = lop.rules.firstOf(
    'style name matcher',
    lop.rules.then(
      lop.rules
        .sequence(
          lop.rules.tokenOfType('equals'),
          lop.rules.sequence.cut(),
          lop.rules.sequence.capture(stringRule)
        )
        .head(),
      (styleName) => ({ styleName: documentMatchers.equalTo(styleName) })
    ),
    lop.rules.then(
      lop.rules
        .sequence(
          lop.rules.tokenOfType('startsWith'),
          lop.rules.sequence.cut(),
          lop.rules.sequence.capture(stringRule)
        )
        .head(),
      (styleName) => ({ styleName: documentMatchers.startsWith(styleName) })
    )
  );

  var styleNameRule = lop.rules
    .sequence(
      lop.rules.tokenOfType('open-square-bracket'),
      lop.rules.sequence.cut(),
      lop.rules.token('identifier', 'style-name'),
      lop.rules.sequence.capture(styleNameMatcherRule),
      lop.rules.tokenOfType('close-square-bracket')
    )
    .head();

  var listTypeRule = lop.rules.firstOf(
    'list type',
    identifierToConstant('ordered-list', { isOrdered: true }),
    identifierToConstant('unordered-list', { isOrdered: false })
  );
  var listRule = sequence(
    lop.rules.tokenOfType('colon'),
    sequence.capture(listTypeRule),
    sequence.cut(),
    lop.rules.tokenOfType('open-paren'),
    sequence.capture(integerRule),
    lop.rules.tokenOfType('close-paren')
  ).map((listType, levelNumber) => ({
    list: {
      isOrdered: listType.isOrdered,
      levelIndex: levelNumber - 1,
    },
  }));

  function createMatcherSuffixesRule(rules) {
    var matcherSuffix = lop.rules.firstOf.apply(
      lop.rules.firstOf,
      ['matcher suffix'].concat(rules)
    );
    var matcherSuffixes = lop.rules.zeroOrMore(matcherSuffix);
    return lop.rules.then(matcherSuffixes, (suffixes) => {
      var matcherOptions = {};
      suffixes.forEach((suffix) => {
        _.extend(matcherOptions, suffix);
      });
      return matcherOptions;
    });
  }

  var paragraphOrRun = sequence(
    sequence.capture(elementTypeRule),
    sequence.capture(
      createMatcherSuffixesRule([styleIdRule, styleNameRule, listRule])
    )
  ).map((createMatcher, matcherOptions) => createMatcher(matcherOptions));

  var table = sequence(
    lop.rules.token('identifier', 'table'),
    sequence.capture(createMatcherSuffixesRule([styleIdRule, styleNameRule]))
  ).map((options) => documentMatchers.table(options));

  var bold = identifierToConstant('b', documentMatchers.bold);
  var italic = identifierToConstant('i', documentMatchers.italic);
  var underline = identifierToConstant('u', documentMatchers.underline);
  var strikethrough = identifierToConstant(
    'strike',
    documentMatchers.strikethrough
  );
  var allCaps = identifierToConstant('all-caps', documentMatchers.allCaps);
  var smallCaps = identifierToConstant(
    'small-caps',
    documentMatchers.smallCaps
  );

  var highlight = sequence(
    lop.rules.token('identifier', 'highlight'),
    lop.rules.sequence.capture(
      lop.rules.optional(
        lop.rules
          .sequence(
            lop.rules.tokenOfType('open-square-bracket'),
            lop.rules.sequence.cut(),
            lop.rules.token('identifier', 'color'),
            lop.rules.tokenOfType('equals'),
            lop.rules.sequence.capture(stringRule),
            lop.rules.tokenOfType('close-square-bracket')
          )
          .head()
      )
    )
  ).map((color) =>
    documentMatchers.highlight({
      color: color.valueOrElse(undefined),
    })
  );

  var commentReference = identifierToConstant(
    'comment-reference',
    documentMatchers.commentReference
  );

  var commentRangeStart = identifierToConstant(
    'comment-range-start',
    documentMatchers.commentRangeStart
  );

  var commentRangeEnd = identifierToConstant(
    'comment-range-end',
    documentMatchers.commentRangeEnd
  );

  var inserted = identifierToConstant('ins', documentMatchers.inserted);

  var deleted = identifierToConstant('del', documentMatchers.deleted);

  var breakMatcher = sequence(
    lop.rules.token('identifier', 'br'),
    sequence.cut(),
    lop.rules.tokenOfType('open-square-bracket'),
    lop.rules.token('identifier', 'type'),
    lop.rules.tokenOfType('equals'),
    sequence.capture(stringRule),
    lop.rules.tokenOfType('close-square-bracket')
  ).map((breakType) => {
    switch (breakType) {
      case 'line':
        return documentMatchers.lineBreak;
      case 'page':
        return documentMatchers.pageBreak;
      case 'column':
        return documentMatchers.columnBreak;
      default:
        throw new Error('Unknown break type: ' + breakType);
    }
  });

  return lop.rules.firstOf(
    'element type',
    paragraphOrRun,
    table,
    bold,
    italic,
    underline,
    strikethrough,
    allCaps,
    smallCaps,
    highlight,
    commentReference,
    commentRangeStart,
    commentRangeEnd,
    inserted,
    deleted,
    breakMatcher
  );
}
