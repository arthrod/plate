// Lines 3447-3456 in old_implementation.js
function combineMessages(results) {
  var messages = [];
  _.flatten(_.pluck(results, 'messages'), true).forEach((message) => {
    if (!containsMessage(messages, message)) {
      messages.push(message);
    }
  });
  return messages;
}
