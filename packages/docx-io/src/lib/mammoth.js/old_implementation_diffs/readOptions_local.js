// lib/options-reader.ts:69
function readOptions(options) {
  options = options || {};
  return Object.assign({}, standardOptions, options, {
    customStyleMap: readStyleMap(options.styleMap),
    readStyleMap() {
      var styleMap = this.customStyleMap;
      if (this.includeEmbeddedStyleMap) {
        styleMap = styleMap.concat(readStyleMap(this.embeddedStyleMap));
      }
      if (this.includeDefaultStyleMap) {
        styleMap = styleMap.concat(defaultStyleMap);
      }
      return styleMap;
    },
  });
}
