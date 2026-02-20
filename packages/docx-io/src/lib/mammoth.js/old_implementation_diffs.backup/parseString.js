// Lines 3837-3848 in old_implementation.js
function parseString(rule, string) {
  var tokens = tokenise(string);
  var parser = lop.Parser();
  var parseResult = parser.parseTokens(rule, tokens);
  if (parseResult.isSuccess()) {
    return results.success(parseResult.value());
  }
  return new results.Result(null, [
    results.warning(describeFailure(string, parseResult)),
  ]);
}
