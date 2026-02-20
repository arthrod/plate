var promises = require('./promises.ts');
var documents = require('./documents.ts');
var htmlPaths = require('./styles/html-paths.ts');
var results = require('./results.ts');
var images = require('./images.ts');
var Html = require('./html/index.ts');
var writers = require('./writers/index.ts');

exports.DocumentConverter = DocumentConverter;

// Token prefixes for tracked changes - parsed by import-toolbar-button.tsx
var DOCX_INSERTION_START_TOKEN_PREFIX = '[[DOCX_INS_START:';
var DOCX_INSERTION_END_TOKEN_PREFIX = '[[DOCX_INS_END:';
var DOCX_INSERTION_TOKEN_SUFFIX = ']]';
var DOCX_DELETION_START_TOKEN_PREFIX = '[[DOCX_DEL_START:';
var DOCX_DELETION_END_TOKEN_PREFIX = '[[DOCX_DEL_END:';
var DOCX_DELETION_TOKEN_SUFFIX = ']]';
var DOCX_COMMENT_START_TOKEN_PREFIX = '[[DOCX_CMT_START:';
var DOCX_COMMENT_END_TOKEN_PREFIX = '[[DOCX_CMT_END:';
var DOCX_COMMENT_TOKEN_SUFFIX = ']]';

function DocumentConverter(options) {
  return {
    convertToHtml(element) {
      var comments = (
        element.type === documents.types.document ? element.comments : []
      ).reduce((indexedComments, comment) => {
        indexedComments[comment.commentId] = comment;
        return indexedComments;
      }, {});
      var conversion = new DocumentConversion(options, comments);
      return conversion.convertToHtml(element);
    },
  };
}

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
    var nodes = () => convertElements(run.children, messages, options);
    var paths = [];
    if (run.highlight !== null) {
      var path = findHtmlPath({ type: 'highlight', color: run.highlight });
      if (path) {
        paths.push(path);
      }
    }
    if (run.isSmallCaps) {
      paths.push(findHtmlPathForRunProperty('smallCaps'));
    }
    if (run.isAllCaps) {
      paths.push(findHtmlPathForRunProperty('allCaps'));
    }
    if (run.isStrikethrough) {
      paths.push(findHtmlPathForRunProperty('strikethrough', 's'));
    }
    if (run.isUnderline) {
      paths.push(findHtmlPathForRunProperty('underline'));
    }
    if (run.verticalAlignment === documents.verticalAlignment.subscript) {
      paths.push(htmlPaths.element('sub', {}, { fresh: false }));
    }
    if (run.verticalAlignment === documents.verticalAlignment.superscript) {
      paths.push(htmlPaths.element('sup', {}, { fresh: false }));
    }
    if (run.isItalic) {
      paths.push(findHtmlPathForRunProperty('italic', 'em'));
    }
    if (run.isBold) {
      paths.push(findHtmlPathForRunProperty('bold', 'strong'));
    }
    var stylePath = htmlPaths.empty;
    var style = findStyle(run);
    if (style) {
      stylePath = style.to;
    } else if (run.styleId) {
      messages.push(unrecognisedStyleWarning('run', run));
    }
    paths.push(stylePath);

    paths.forEach((path) => {
      nodes = path.wrap.bind(path, nodes);
    });

    return nodes();
  }

  function findHtmlPathForRunProperty(elementType, defaultTagName) {
    var path = findHtmlPath({ type: elementType });
    if (path) {
      return path;
    }
    if (defaultTagName) {
      return htmlPaths.element(defaultTagName, {}, { fresh: false });
    }
    return htmlPaths.empty;
  }

  function findHtmlPath(element, defaultPath) {
    var style = findStyle(element);
    return style ? style.to : defaultPath;
  }

  function findStyle(element) {
    for (var i = 0; i < styleMap.length; i++) {
      if (styleMap[i].from.matches(element)) {
        return styleMap[i];
      }
    }
  }

  function recoveringConvertImage(convertImage) {
    return (image, messages) =>
      promises
        .attempt(() => convertImage(image, messages))
        .catch((error) => {
          messages.push(results.error(error));
          return [];
        });
  }

  function noteHtmlId(note) {
    return referentHtmlId(note.noteType, note.noteId);
  }

  function noteRefHtmlId(note) {
    return referenceHtmlId(note.noteType, note.noteId);
  }

  function referentHtmlId(referenceType, referenceId) {
    return htmlId(referenceType + '-' + referenceId);
  }

  function referenceHtmlId(referenceType, referenceId) {
    return htmlId(referenceType + '-ref-' + referenceId);
  }

  function htmlId(suffix) {
    return idPrefix + suffix;
  }

  var defaultTablePath = htmlPaths.elements([
    htmlPaths.element('table', {}, { fresh: true }),
  ]);

  function convertTable(element, messages, options) {
    return findHtmlPath(element, defaultTablePath).wrap(() =>
      convertTableChildren(element, messages, options)
    );
  }

  function convertTableChildren(element, messages, options) {
    var bodyIndex = element.children.findIndex(
      (child) => child.type !== documents.types.tableRow || !child.isHeader
    );
    if (bodyIndex === -1) {
      bodyIndex = element.children.length;
    }
    var children;
    if (bodyIndex === 0) {
      children = convertElements(
        element.children,
        messages,
        Object.assign({}, options, { isTableHeader: false })
      );
    } else {
      var headRows = convertElements(
        element.children.slice(0, bodyIndex),
        messages,
        Object.assign({}, options, { isTableHeader: true })
      );
      var bodyRows = convertElements(
        element.children.slice(bodyIndex),
        messages,
        Object.assign({}, options, { isTableHeader: false })
      );
      children = [
        Html.freshElement('thead', {}, headRows),
        Html.freshElement('tbody', {}, bodyRows),
      ];
    }
    return [Html.forceWrite].concat(children);
  }

  function convertTableRow(element, messages, options) {
    var children = convertElements(element.children, messages, options);
    return [Html.freshElement('tr', {}, [Html.forceWrite].concat(children))];
  }

  function convertTableCell(element, messages, options) {
    var tagName = options.isTableHeader ? 'th' : 'td';
    var children = convertElements(element.children, messages, options);
    var attributes = {};
    if (element.colSpan !== 1) {
      attributes.colspan = element.colSpan.toString();
    }
    if (element.rowSpan !== 1) {
      attributes.rowspan = element.rowSpan.toString();
    }

    return [
      Html.freshElement(
        tagName,
        attributes,
        [Html.forceWrite].concat(children)
      ),
    ];
  }
  function convertCommentReference(reference, messages, options) {
    return findHtmlPath(reference, htmlPaths.ignore).wrap(() => {
      var comment = comments[reference.commentId];
      if (!comment) {
        return [];
      }

      if (options.emitDocxCommentTokens) {
        var payload = buildCommentPayload(comment, messages, options);
        payload.isPoint = true;

        var startToken =
          DOCX_COMMENT_START_TOKEN_PREFIX +
          encodeURIComponent(JSON.stringify(payload)) +
          DOCX_COMMENT_TOKEN_SUFFIX;
        var endToken =
          DOCX_COMMENT_END_TOKEN_PREFIX +
          encodeURIComponent(reference.commentId) +
          DOCX_COMMENT_TOKEN_SUFFIX;
        return [Html.text(startToken + endToken)];
      }

      var count = referencedComments.length + 1;
      var label = '[' + commentAuthorLabel(comment) + count + ']';
      referencedComments.push({ label, comment });
      return [
        Html.freshElement(
          'a',
          {
            href: '#' + referentHtmlId('comment', reference.commentId),
            id: referenceHtmlId('comment', reference.commentId),
          },
          [Html.text(label)]
        ),
      ];
    });
  }

  function convertComment(referencedComment, messages, options) {
    var label = referencedComment.label;
    var comment = referencedComment.comment;
    var body = convertElements(comment.body || [], messages, options).concat([
      Html.nonFreshElement('p', {}, [
        Html.text(' '),
        Html.freshElement(
          'a',
          { href: '#' + referenceHtmlId('comment', comment.commentId) },
          [Html.text('↑')]
        ),
      ]),
    ]);

    return [
      Html.freshElement(
        'dt',
        { id: referentHtmlId('comment', comment.commentId) },
        [Html.text('Comment ' + label)]
      ),
      Html.freshElement('dd', {}, body),
    ];
  }

  function getReplies(paraId) {
    if (!paraId) return [];

    var replies = [];
    Object.keys(comments).forEach((id) => {
      var comment = comments[id];
      if (comment.parentParaId === paraId) {
        replies.push(comment);
      }
    });

    replies.sort((a, b) => ((a.date || '') > (b.date || '') ? 1 : -1));
    return replies;
  }

  function buildCommentPayload(comment, messages, options) {
    var payload = {
      id: comment.commentId,
      authorName: comment.authorName,
      authorInitials: comment.authorInitials,
      date: comment.date,
      paraId: comment.paraId,
      parentParaId: comment.parentParaId,
    };

    if (comment.body && comment.body.length > 0) {
      payload.text = extractTextFromElements(comment.body);
      try {
        var richContent = convertElements(comment.body, messages, options);
        payload.body = Html.simplify(richContent);
      } catch (error) {
        var detail =
          error && typeof error.message === 'string' ? error.message : '';
        messages.push(
          results.error(
            new Error(
              'Failed to convert comment body for comment ' +
                comment.commentId +
                (detail ? ': ' + detail : '')
            )
          )
        );
      }
    }

    var replies = getReplies(comment.paraId);
    if (replies.length > 0) {
      payload.replies = replies.map((reply) =>
        buildCommentPayload(reply, messages, options)
      );
    }

    return payload;
  }

  function extractTextFromElements(elements) {
    var text = '';

    elements.forEach((element) => {
      if (element.type === documents.types.text) {
        text += element.value;
        return;
      }

      if (element.type === documents.types.paragraph) {
        text += extractTextFromElements(element.children || []) + '\n';
        return;
      }

      if (element.children) {
        text += extractTextFromElements(element.children);
      }
    });

    return text;
  }

  function convertBreak(element, messages, options) {
    return htmlPathForBreak(element).wrap(() => []);
  }

  function htmlPathForBreak(element) {
    var style = findStyle(element);
    if (style) {
      return style.to;
    }
    if (element.breakType === 'line') {
      return htmlPaths.topLevelElement('br');
    }
    return htmlPaths.empty;
  }

  var elementConverters = {
    document(document, messages, options) {
      var children = convertElements(document.children, messages, options);
      var notes = noteReferences.map((noteReference) =>
        document.notes.resolve(noteReference)
      );
      var notesNodes = convertElements(notes, messages, options);
      return children.concat([
        Html.freshElement('ol', {}, notesNodes),
        Html.freshElement(
          'dl',
          {},
          flatMap(referencedComments, (referencedComment) =>
            convertComment(referencedComment, messages, options)
          )
        ),
      ]);
    },
    paragraph: convertParagraph,
    run: convertRun,
    text(element, messages, options) {
      void messages;
      void options;
      return [Html.text(element.value)];
    },
    tab(element, messages, options) {
      return [Html.text('\t')];
    },
    hyperlink(element, messages, options) {
      var href = element.anchor ? '#' + htmlId(element.anchor) : element.href;
      var attributes = { href };
      if (element.targetFrame != null) {
        attributes.target = element.targetFrame;
      }

      var children = convertElements(element.children, messages, options);
      return [Html.nonFreshElement('a', attributes, children)];
    },
    checkbox(element) {
      var attributes = { type: 'checkbox' };
      if (element.checked) {
        attributes['checked'] = 'checked';
      }
      return [Html.freshElement('input', attributes)];
    },
    bookmarkStart(element, messages, options) {
      var anchor = Html.freshElement(
        'a',
        {
          id: htmlId(element.name),
        },
        [Html.forceWrite]
      );
      return [anchor];
    },
    noteReference(element, messages, options) {
      void messages;
      void options;
      noteReferences.push(element);
      var anchor = Html.freshElement(
        'a',
        {
          href: '#' + noteHtmlId(element),
          id: noteRefHtmlId(element),
        },
        [Html.text('[' + noteNumber++ + ']')]
      );

      return [Html.freshElement('sup', {}, [anchor])];
    },
    note(element, messages, options) {
      var children = convertElements(element.body, messages, options);
      var backLink = Html.elementWithTag(
        htmlPaths.element('p', {}, { fresh: false }),
        [
          Html.text(' '),
          Html.freshElement('a', { href: '#' + noteRefHtmlId(element) }, [
            Html.text('↑'),
          ]),
        ]
      );
      var body = children.concat([backLink]);

      return Html.freshElement('li', { id: noteHtmlId(element) }, body);
    },
    commentReference: convertCommentReference,
    comment: convertComment,
    commentRangeStart(element, messages, options) {
      if (!options.emitDocxCommentTokens) {
        return [];
      }

      var comment = comments[element.commentId];
      if (!comment) {
        messages.push(
          results.warning(
            'Comment with ID ' +
              element.commentId +
              ' was referenced by a range but not found in the document'
          )
        );
        return [];
      }

      var payload = buildCommentPayload(comment, messages, options);
      var token =
        DOCX_COMMENT_START_TOKEN_PREFIX +
        encodeURIComponent(JSON.stringify(payload)) +
        DOCX_COMMENT_TOKEN_SUFFIX;
      return [Html.text(token)];
    },
    commentRangeEnd(element, messages, options) {
      if (!options.emitDocxCommentTokens) {
        return [];
      }

      var token =
        DOCX_COMMENT_END_TOKEN_PREFIX +
        encodeURIComponent(element.commentId) +
        DOCX_COMMENT_TOKEN_SUFFIX;
      return [Html.text(token)];
    },
    inserted(element, messages, options) {
      if (!options.emitDocxTrackedChangeTokens) {
        return convertElements(element.children, messages, options);
      }
      var children = convertElements(element.children, messages, options);
      // Use Word's original changeId if available, otherwise generate one
      var changeId = element.changeId || 'ins-' + trackedChangeIdCounter++;
      var payload = encodeTrackedChangePayload({
        id: changeId,
        author: element.author,
        date: element.date,
      });
      var startToken =
        DOCX_INSERTION_START_TOKEN_PREFIX +
        payload +
        DOCX_INSERTION_TOKEN_SUFFIX;
      var endToken =
        DOCX_INSERTION_END_TOKEN_PREFIX +
        changeId +
        DOCX_INSERTION_TOKEN_SUFFIX;
      return [Html.text(startToken)]
        .concat(children)
        .concat([Html.text(endToken)]);
    },
    deleted(element, messages, options) {
      if (!options.emitDocxTrackedChangeTokens) {
        return [];
      }
      var children = convertElements(element.children, messages, options);
      // Use Word's original changeId if available, otherwise generate one
      var changeId = element.changeId || 'del-' + trackedChangeIdCounter++;
      var payload = encodeTrackedChangePayload({
        id: changeId,
        author: element.author,
        date: element.date,
      });
      var startToken =
        DOCX_DELETION_START_TOKEN_PREFIX + payload + DOCX_DELETION_TOKEN_SUFFIX;
      var endToken =
        DOCX_DELETION_END_TOKEN_PREFIX + changeId + DOCX_DELETION_TOKEN_SUFFIX;
      return [Html.text(startToken)]
        .concat(children)
        .concat([Html.text(endToken)]);
    },
    image: deferredConversion(
      recoveringConvertImage(options.convertImage || images.dataUri)
    ),
    table: convertTable,
    tableRow: convertTableRow,
    tableCell: convertTableCell,
    break: convertBreak,
  };
  return {
    convertToHtml,
  };
}

var deferredId = 1;

function encodeTrackedChangePayload(payload) {
  return encodeURIComponent(JSON.stringify(payload));
}

function deferredConversion(func) {
  return (element, messages, options) => [
    {
      type: 'deferred',
      id: deferredId++,
      value() {
        return func(element, messages, options);
      },
    },
  ];
}

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

function flatMap(values, func) {
  return values.flatMap(func);
}

function walkHtml(nodes, callback) {
  nodes.forEach((node) => {
    callback(node);
    if (node.children) {
      walkHtml(node.children, callback);
    }
  });
}

var commentAuthorLabel = (exports.commentAuthorLabel =
  function commentAuthorLabel(comment) {
    return comment.authorInitials || '';
  });
