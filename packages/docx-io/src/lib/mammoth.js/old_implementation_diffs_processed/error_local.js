// Found in: /schema.ts:317
// Lines 3439-3446 in old_implementation.js
function error(exception) {
  return {
    type: 'error',
    message: exception.message,
    error: exception,
  };
}
