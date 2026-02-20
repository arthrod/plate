// Lines 2806-2845 in old_implementation.js
function readStylesXml(root) {
  var paragraphStyles = {};
  var characterStyles = {};
  var tableStyles = {};
  var numberingStyles = {};

  var styles = {
    paragraph: paragraphStyles,
    character: characterStyles,
    table: tableStyles,
    numbering: numberingStyles,
  };

  root.getElementsByTagName('w:style').forEach((styleElement) => {
    var style = readStyleElement(styleElement);
    var styleSet = styles[style.type];

    // Per 17.7.4.17 style (Style Definition) of ECMA-376 4th edition Part 1:
    //
    // > If multiple style definitions each declare the same value for their
    // > styleId, then the first such instance shall keep its current
    // > identifier with all other instances being reassigned in any manner
    // > desired.
    //
    // For the purpose of conversion, there's no point holding onto styles
    // with reassigned style IDs, so we ignore such style definitions.

    if (styleSet && styleSet[style.styleId] === undefined) {
      styleSet[style.styleId] = style;
    }
  });

  return new Styles(
    paragraphStyles,
    characterStyles,
    tableStyles,
    numberingStyles
  );
}
