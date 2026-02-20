// lib/style-reader.ts:16
function createStyleRule() {
  return lop.rules
    .sequence(
      lop.rules.sequence.capture(documentMatcherRule()),
      lop.rules.tokenOfType('whitespace'),
      lop.rules.tokenOfType('arrow'),
      lop.rules.sequence.capture(
        lop.rules.optional(
          lop.rules
            .sequence(
              lop.rules.tokenOfType('whitespace'),
              lop.rules.sequence.capture(htmlPathRule())
            )
            .head()
        )
      ),
      lop.rules.tokenOfType('end')
    )
    .map((documentMatcher, htmlPath) => ({
      from: documentMatcher,
      to: htmlPath.valueOrElse(htmlPaths.empty),
    }));
}
