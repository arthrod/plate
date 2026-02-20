// Found in: /options-reader.ts:1
// Lines 3299-3315 in old_implementation.js
function readOptions(options) {
  options = options || {};
  return _.extend({}, standardOptions, options, {
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
