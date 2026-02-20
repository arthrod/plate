// lib/documents.ts:205
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
