// lib/schema.ts:395
function containsMessage(messages: Message[], message: Message): boolean {
  return messages.some(
    (existing) =>
      existing.type === message.type && existing.message === message.message
  );
}
