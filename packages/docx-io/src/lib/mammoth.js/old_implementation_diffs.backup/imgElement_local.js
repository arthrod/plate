// lib/images.ts:6
function imgElement(func) {
  return (element, messages) =>
    promises.when(func(element)).then((result) => {
      var attributes = {};
      if (element.altText) {
        attributes.alt = element.altText;
      }
      Object.assign(attributes, result);

      return [Html.freshElement('img', attributes)];
    });
}
