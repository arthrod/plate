// lib/schema.ts:383
function combineMessages(results: { messages: Message[] }[]): Message[] {
  const messages: Message[] = [];
  for (const result of results) {
    for (const message of result.messages) {
      if (!containsMessage(messages, message)) {
        messages.push(message);
      }
    }
  }
  return messages;
}
