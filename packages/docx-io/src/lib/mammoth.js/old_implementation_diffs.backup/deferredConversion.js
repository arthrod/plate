// Lines 680-691 in old_implementation.js
function deferredConversion(func) {
  return (element, messages, options) => [
    {
      type: 'deferred',
      id: deferredId++,
      value() {
        return func(element, messages, options);
      },
    },
  ];
}
