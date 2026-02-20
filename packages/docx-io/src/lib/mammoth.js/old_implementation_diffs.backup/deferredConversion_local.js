// lib/document-to-html.ts:522
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
