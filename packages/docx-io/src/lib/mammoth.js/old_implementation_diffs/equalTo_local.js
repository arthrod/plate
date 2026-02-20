// lib/styles/document-matchers.ts:96
function equalTo(value) {
  return {
    operator: operatorEqualTo,
    operand: value,
  };
}
