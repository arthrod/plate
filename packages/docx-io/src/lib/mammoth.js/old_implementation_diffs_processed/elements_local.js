// Found in: /styles/html-paths.ts:4
// Lines 4003-4013 in old_implementation.js
function elements(elementStyles) {
  return new HtmlPath(
    elementStyles.map((elementStyle) => {
      if (_.isString(elementStyle)) {
        return element(elementStyle);
      }
      return elementStyle;
    })
  );
}
