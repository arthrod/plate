// lib/styles/document-matchers.ts:103
function startsWith(value) {
  return {
    operator: operatorStartsWith,
    operand: value,
  };
}
