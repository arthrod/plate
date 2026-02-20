// lib/docx/body-reader.ts:855
function combineResults(results) {
  var result = Result.combine(results.map((item) => item._result));
  return new ReadResult(
    result.value.map((item) => item.element).flat(),
    result.value
      .map((item) => item.extra)
      .flat()
      .filter(identity),
    result.messages
  );
}
