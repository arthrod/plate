// lib/style-reader.ts:392
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
