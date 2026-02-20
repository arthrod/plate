// lib/writers/markdown-writer.ts:151
function escapeMarkdown(value) {
  return value.replace(/\\/g, '\\\\').replace(/([`*_{}[\]()#+\-.!])/g, '\\$1');
}
