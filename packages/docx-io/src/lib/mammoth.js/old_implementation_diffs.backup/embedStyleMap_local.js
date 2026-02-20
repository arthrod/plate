// lib/index.ts:86
function embedStyleMap(input, styleMap) {
  return withDone(
    unzip
    .openZip(input)
    .then((docxFile) =>
      Promise.resolve(docxStyleMap.writeStyleMap(docxFile, styleMap)).then(
        () => docxFile
      )
    )
    .then((docxFile) => docxFile.toArrayBuffer())
    .then((arrayBuffer) => ({
      toArrayBuffer() {
        return arrayBuffer;
      },
      toBuffer() {
        return Buffer.from(arrayBuffer);
      },
    }))
  );
}
