// lib/styles/html-paths.ts:7
function topLevelElement(tagName, attributes) {
  return elements([element(tagName, attributes, { fresh: true })]);
}
