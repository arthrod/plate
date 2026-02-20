// Found in: /schema.ts:153
// Lines 927-955 in old_implementation.js
function Image(options) {
  return {
    type: types.image,
    // `read` is retained for backwards compatibility, but other read
    // methods should be preferred.
    read(encoding) {
      if (encoding) {
        return options.readImage(encoding);
      }
      return options
        .readImage()
        .then((arrayBuffer) => Buffer.from(arrayBuffer));
    },
    readAsArrayBuffer() {
      return options.readImage();
    },
    readAsBase64String() {
      return options.readImage('base64');
    },
    readAsBuffer() {
      return options
        .readImage()
        .then((arrayBuffer) => Buffer.from(arrayBuffer));
    },
    altText: options.altText,
    contentType: options.contentType,
  };
}
