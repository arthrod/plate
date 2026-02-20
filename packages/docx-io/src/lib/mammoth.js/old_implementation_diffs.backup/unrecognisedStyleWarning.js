// Lines 692-704 in old_implementation.js
function unrecognisedStyleWarning(type, element) {
  return results.warning(
    'Unrecognised ' +
      type +
      " style: '" +
      element.styleName +
      "'" +
      ' (Style ID: ' +
      element.styleId +
      ')'
  );
}
