// Lines 3457-3460 in old_implementation.js
function containsMessage(messages, message) {
  return _.find(messages, isSameMessage.bind(null, message)) !== undefined;
}
