// lib/document-to-html.ts:34
function DocumentConversion(options, comments) {
  var noteNumber = 1;
  // Counter for generating unique IDs for tracked changes without explicit IDs
  var trackedChangeIdCounter = 1;

  var noteReferences = [];

  var referencedComments = [];

  options = Object.assign({ ignoreEmptyParagraphs: true }, options);
  var idPrefix = options.idPrefix === undefined ? '' : options.idPrefix;
  var ignoreEmptyParagraphs = options.ignoreEmptyParagraphs;

  var defaultParagraphStyle = htmlPaths.topLevelElement('p');

  var styleMap = options.styleMap || [];

  function convertToHtml(document) {
    var messages = [];

    var html = elementToHtml(document, messages, {});

    var deferredNodes = [];
    walkHtml(html, (node) => {
      if (node.type === 'deferred') {
        deferredNodes.push(node);
      }
    });
    var deferredValues = {};
    return promises
      .mapSeries(deferredNodes, (deferred) =>
        deferred.value().then((value) => {
          deferredValues[deferred.id] = value;
        })
      )
      .then(() => {
        function replaceDeferred(nodes) {
          return flatMap(nodes, (node) => {
            if (node.type === 'deferred') {
              return deferredValues[node.id];
            }
            if (node.children) {
              return [
                Object.assign({}, node, {
                  children: replaceDeferred(node.children),
                }),
              ];
            }
            return [node];
          });
        }
        var writer = writers.writer({
          prettyPrint: options.prettyPrint,
          outputFormat: options.outputFormat,
        });
        Html.write(writer, Html.simplify(replaceDeferred(html)));
        return new results.Result(writer.asString(), messages);
      });
  }

  function convertElements(elements, messages, options) {
    return flatMap(elements, (element) =>
      elementToHtml(element, messages, options)
    );
  }

  function elementToHtml(element, messages, options) {
    if (!options) {
      throw new Error('options not set');
    }
    var handler = elementConverters[element.type];
    if (handler) {
      return handler(element, messages, options);
    }
    return [];
  }

  function convertParagraph(element, messages, options) {
    return htmlPathForParagraph(element, messages).wrap(() => {
      var content = convertElements(element.children, messages, options);
      if (ignoreEmptyParagraphs) {
        return content;
      }
      return [Html.forceWrite].concat(content);
    });
  }

  function htmlPathForParagraph(element, messages) {
    var style = findStyle(element);

    if (style) {
      return style.to;
    }
    if (element.styleId) {
      messages.push(unrecognisedStyleWarning('paragraph', element));
    }
    return defaultParagraphStyle;
  }

  function convertRun(run, messages, options) {
