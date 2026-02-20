// lib/vendor/lop/lib/option.ts:29
function callOrReturn(value) {
  if (typeof value === 'function') {
    return value();
  }
  return value;
}
