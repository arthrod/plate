// Lines 3316-3328 in old_implementation.js
function readStyleMap(styleMap) {
  if (!styleMap) {
    return [];
  }
  if (_.isString(styleMap)) {
    return styleMap
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '' && line.charAt(0) !== '#');
  }
  return styleMap;
}
