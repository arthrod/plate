var _ = require("underscore");

var promises = require("./promises");
var documents = require("./documents");
var htmlPaths = require("./styles/html-paths");
var results = require("./results");
var images = require("./images");
var Html = require("./html");
var writers = require("./writers");

exports.DocumentConverter = DocumentConverter;

function DocumentConverter(options) {
  return {
    convertToHtml: function (element) {
      var comments = _.indexBy(
        element.type === documents.types.document ? element.comments : [],
        "commentId"
      );
      var conversion = new DocumentConversion(options, comments);
      return conversion.convertToHtml(element);
    },
  };
}

function DocumentConversion(options, comments) {
  var noteNumber = 1;

  var noteReferences = [];

  var referencedComments = [];

  options = _.extend({ ignoreEmptyParagraphs: true }, options);
  var idPrefix = options.idPrefix === undefined ? "" : options.idPrefix;
  var ignoreEmptyParagraphs = options.ignoreEmptyParagraphs;

  var defaultParagraphStyle = htmlPaths.topLevelElement("p");

  var styleMap = options.styleMap || [];

  function convertToHtml(document) {
    var messages = [];

    var html = elementToHtml(document, messages, {});

    var deferredNodes = [];
    walkHtml(html, function (node) {
      if (node.type === "deferred") {
        deferredNodes.push(node);
      }
    });
    var deferredValues = {};
    return promises
      .mapSeries(deferredNodes, function (deferred) {
        return deferred.value().then(function (value) {
          deferredValues[deferred.id] = value;
        });
      })
      .then(function () {
        function replaceDeferred(nodes) {
          return flatMap(nodes, function (node) {
            if (node.type === "deferred") {
              return deferredValues[node.id];
            } else if (node.children) {
              return [
                _.extend({}, node, {
                  children: replaceDeferred(node.children),
                }),
              ];
            } else {
              return [node];
            }
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
    return flatMap(elements, function (element) {
      return elementToHtml(element, messages, options);
    });
  }

  function elementToHtml(element, messages, options) {
    if (!options) {
      throw new Error("options not set");
    }
    var handler = elementConverters[element.type];
    if (handler) {
      return handler(element, messages, options);
    } else {
      return [];
    }
  }

  function convertParagraph(element, messages, options) {
    var paragraph = htmlPathForParagraph(element, messages);
    var wp = paragraph.wrap(function () {
      if (element.numbering && !element.numbering.isOrdered) {
        var newChildren = {
          type: "run",
          children: [{ type: "text", value: element.numbering.symbol }],
          font: element.numbering.font,
          color: element.numbering.color,
        };
        element.children.unshift(newChildren);
      }

      var content = convertElements(element.children, messages, options);
      if (ignoreEmptyParagraphs) {
        return content;
      } else {
        return [Html.forceWrite].concat(content);
      }
    });
    if (
      element.styleId == "ListParagraph" &&
      element.numbering &&
      element.numbering.level
    ) {
      var tagAttributes = {
        class: wp[0].tag.attributes.class,
        "data-indent": parseInt(element.numbering.level).toString(),
        "list-style-level": (parseInt(element.numbering.level) + 1).toString(),
      };

      wp[0].tag = htmlPaths.element("p", tagAttributes, {
        fresh: true,
      });
    }
    // [FS] 09-02-2023
    // Handle alignment and Heading style
    if (element.alignment || element.styleId) {
      var attr = {};
      if (element.alignment) {
        attr.align = element.alignment;
      }
      if (element.styleId === "Chapter Header") {
        element.styleName = element.styleId;
      }
      if (element.styleName) {
        if (element.styleName == "heading 1") {
          attr.className = "Chapter Header";
        }
        if (element.styleId === 'Heading2') {
          attr.className = 'Header 2';
        }
        else if (element.styleId == "ListParagraph") {
          attr.className = "List-style";
        } else {
          attr.className = element.styleName;
        }
      }
      if (wp[0] !== undefined) {
        // **** Note *****
        // This code works only in ES6
        // Temp fix: comment this line before build and manually uncomment this on bundled file on deployment
        var attributes = Object.assign({}, wp[0].tag.attributes, attr);
        var tag = htmlPaths.element("p", attributes, { fresh: true });
        wp[0].tag = tag;
        // **** End *****
        // not working need to fix it
        // var tg = wp[0].tag.attributes;
        // Object.assign(tg, attr);
        // var tag = htmlPaths.element('p', tg, { fresh: true });
        // wp[0].tag = tag;
      }
    }

    if (element.attributes && element.attributes.style) {
      var tag = htmlPaths.element("span", element.attributes, { fresh: true });
      wp[0].tag = tag;
    }

    if (element.attributes && element.attributes.name === "group") {
      var tag = htmlPaths.element("div", element.attributes, { fresh: true });
      wp[0].tag = tag;
    }
    if (element.attrs && element.children.length > 0) {
      // var hrColor = element.attrs['w:color'];
      var hrColor =
        element.attrs["w:color"] === "auto"
          ? "#000000"
          : element.attrs["w:color"];
      return wp.concat(Html.freshElement("hr", { color: hrColor }, []));
    } else {
      return wp;
    }
  }

  function htmlPathForParagraph(element, messages) {
    var style = findStyle(element);

    if (style) {
      return style.to;
    } else {
      if (element.styleId) {
        messages.push(unrecognisedStyleWarning("paragraph", element));
      }
      return defaultParagraphStyle;
    }
  }

  function convertRun(run, messages, options) {
    for (var i = 0; i < run.children.length; i++) {
      if (run.children[i].type === "hyperlink" && run.color) {
        run.children[i]["color"] = run.color;
      }
    }
    var nodes = function () {
      return convertElements(run.children, messages, options);
    };
    var paths = [];
    if (run.isSmallCaps) {
      paths.push(findHtmlPathForRunProperty("smallCaps"));
    }
    if (run.isAllCaps) {
      paths.push(findHtmlPathForRunProperty("allCaps"));
    }
    if (run.isStrikethrough) {
      paths.push(findHtmlPathForRunProperty("strikethrough", "s"));
    }
    if (run.isUnderline) {
      paths.push(findHtmlPathForRunProperty("underline"));
    }
    if (run.verticalAlignment === documents.verticalAlignment.subscript) {
      paths.push(htmlPaths.element("sub", {}, { fresh: false }));
    }
    // [FS] 09-04-2024
    //Manage superscript along with infoicon.
    if (run.verticalAlignment === documents.verticalAlignment.superscript) {
      if (run.children.length > 0 && run.children[0].type === "text") {
        paths.push(htmlPaths.element("sup", {}, { fresh: false }));
      }
    }
    if (run.isItalic) {
      paths.push(findHtmlPathForRunProperty("italic", "em"));
    }
    if (run.isBold) {
      paths.push(findHtmlPathForRunProperty("bold", "strong"));
    }
    //[FS]LIC-270 Adding highlight feature to mammoth
    //Added font color feature to mammoth
    if (run.isHighlight || run.color) {
      paths.push(htmlPaths.element("mark-text-highlight", { 'highlight-color': run.highlightColor, 'color': run.color ? run.color : '#000' }, { fresh: false }));
    }
    // [FS] 09-02-2023
    // Handle Text color
    //run.color!="#000000";
    // if (run.color) {
    //     paths.push(htmlPaths.element('font', { color: run.color }, { fresh: false }));
    // }
    // if (run.font) {
    //     paths.push(htmlPaths.element('font', { style: "font-family:" + run.font }, { fresh: false }));
    // }

    var stylePath = htmlPaths.empty;
    var style = findStyle(run);
    if (style) {
      stylePath = style.to;
    } else if (run.styleId) {
      messages.push(unrecognisedStyleWarning("run", run));
    }
    paths.push(stylePath);

    paths.forEach(function (path) {
      nodes = path.wrap.bind(path, nodes);
    });

    return nodes();
  }

  function findHtmlPathForRunProperty(elementType, defaultTagName) {
    var path = findHtmlPath({ type: elementType });
    if (path) {
      return path;
    } else if (defaultTagName) {
      return htmlPaths.element(defaultTagName, {}, { fresh: false });
    } else {
      return htmlPaths.empty;
    }
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
    return function (image, messages) {
      return promises
        .attempt(function () {
          return convertImage(image, messages);
        })
        .caught(function (error) {
          messages.push(results.error(error));
          return [];
        });
    };
  }

  function noteHtmlId(note) {
    return referentHtmlId(note.noteType, note.noteId);
  }

  function noteRefHtmlId(note) {
    return referenceHtmlId(note.noteType, note.noteId);
  }

  function referentHtmlId(referenceType, referenceId) {
    return htmlId(referenceType + "-" + referenceId);
  }

  function referenceHtmlId(referenceType, referenceId) {
    return htmlId(referenceType + "-" + referenceId);
  }

  function htmlId(suffix) {
    return idPrefix + suffix;
  }

  var defaultTablePath = htmlPaths.elements([
    htmlPaths.element("table", {}, { fresh: true }),
  ]);

  // [FS] 09-02-2023
  // Chapter header table row backgound and border
  function convertTable(element, messages, options) {
    var res = findHtmlPath(element, defaultTablePath).wrap(function () {
      return convertTableChildren(element, messages, options);
    });
    res[0].tag.attributes.style = {};
    if (element.isCusTable) {
      res[0].tag.attributes.style =
        "border-collapse:collapse;background-color:#d8d8d8;";
    } else {
      res[0].tag.attributes.style = "border-collapse:collapse";
    }
    res[0].tag.attributes["border"] = "1px solid #000000";
    return res;
  }

  function convertTableChildren(element, messages, options) {
    var bodyIndex = _.findIndex(element.children, function (child) {
      return !child.type === documents.types.tableRow || !child.isHeader;
    });
    if (bodyIndex === -1) {
      bodyIndex = element.children.length;
    }
    var children;
    if (bodyIndex === 0) {
      children = convertElements(
        element.children,
        messages,
        _.extend({}, options, { isTableHeader: false })
      );
    } else {
      var headRows = convertElements(
        element.children.slice(0, bodyIndex),
        messages,
        _.extend({}, options, { isTableHeader: true })
      );
      var bodyRows = convertElements(
        element.children.slice(bodyIndex),
        messages,
        _.extend({}, options, { isTableHeader: false })
      );
      children = [
        Html.freshElement("thead", {}, headRows),
        Html.freshElement("tbody", {}, bodyRows),
      ];
    }
    return [Html.forceWrite].concat(children);
  }

  function convertTableRow(element, messages, options) {
    var children = convertElements(element.children, messages, options);
    return [Html.freshElement("tr", {}, [Html.forceWrite].concat(children))];
  }

  function convertTableCell(element, messages, options) {
    var tagName = options.isTableHeader ? "th" : "td";
    var children = convertElements(element.children, messages, options);
    var attributes = {};
    if (element.colSpan !== 1) {
      attributes.colspan = element.colSpan.toString();
    }
    if (element.rowSpan !== 1) {
      attributes.rowspan = element.rowSpan.toString();
    }
    if (element.isLogoImg) {
      attributes.style = "mix-blend-mode: multiply;";
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
    return findHtmlPath(reference, htmlPaths.ignore).wrap(function () {
      var comment = comments[reference.commentId];
      var count = referencedComments.length + 1;
      var label = "[" + commentAuthorLabel(comment) + count + "]";
      referencedComments.push({ label: label, comment: comment });
      // TODO: remove duplication with note references
      return [
        Html.freshElement(
          "a",
          {
            href: "#" + referentHtmlId("comment", reference.commentId),
            id: referenceHtmlId("comment", reference.commentId),
          },
          [Html.text(label)]
        ),
      ];
    });
  }

  function convertComment(referencedComment, messages, options) {
    // TODO: remove duplication with note references

    var label = referencedComment.label;
    var comment = referencedComment.comment;
    var body = convertElements(comment.body, messages, options).concat([
      Html.nonFreshElement("p", {}, [
        Html.text(" "),
        Html.freshElement(
          "a",
          { href: "#" + referenceHtmlId("comment", comment.commentId) },
          [Html.text("↑")]
        ),
      ]),
    ]);

    return [
      Html.freshElement(
        "dt",
        { id: referentHtmlId("comment", comment.commentId) },
        [Html.text("Comment " + label)]
      ),
      Html.freshElement("dd", {}, body),
    ];
  }

  function convertBreak(element, messages, options) {
    return htmlPathForBreak(element).wrap(function () {
      return [];
    });
  }

  function htmlPathForBreak(element) {
    var style = findStyle(element);
    if (style) {
      return style.to;
    } else if (element.breakType === "line") {
      return htmlPaths.topLevelElement("br");
    } else {
      return htmlPaths.empty;
    }
  }

  const footNoteHeader = "footnote";
  const endNoteHeader = "endnote";

  // [FS] 09-02-2023
  // To prepare the foototes to be converted as InfoIcon
  /**
   *
   * @param Header: Note Type
   * @param noteReferences: Array of Notes
   * @param document:The current document
   * @param messages:Messages to be shown at bottom
   * @param options
   */
  function prepareNote(Header, noteReferences, document, messages, options) {
    var filter = [];
    for (var i = 0; i < noteReferences.length; i++)
      if (noteReferences[i].noteType === Header) {
        filter.push(noteReferences[i]);
      }
    var NoteData = filter.map(function (noteReference) {
      return document.notes.resolve(noteReference);
    });
    return convertElements(NoteData, messages, options);
  }

  var elementConverters = {
    document: function (document, messages, options) {
      var children = convertElements(document.children, messages, options);
      var footnotesNodes = prepareNote(
        footNoteHeader,
        noteReferences,
        document,
        messages,
        options
      );
      var endnotesNodes = prepareNote(
        endNoteHeader,
        noteReferences,
        document,
        messages,
        options
      );
      return children.concat([
        // [FS] 09-02-2023
        // To prepare the foototes to be converted as InfoIcon
        Html.freshElement("ol", { id: "infoIcon" }, footnotesNodes),
        Html.freshElement("ol", { id: "endNotes" }, endnotesNodes),
        Html.freshElement(
          "dl",
          {},
          flatMap(referencedComments, function (referencedComment) {
            return convertComment(referencedComment, messages, options);
          })
        ),
      ]);
    },
    paragraph: convertParagraph,
    run: convertRun,
    text: function (element, messages, options) {
      return [Html.text(element.value)];
    },
    tab: function (element, messages, options) {
      return [Html.text("\t")];
    },
    hyperlink: function (element, messages, options) {
      var href = element.anchor ? "#" + htmlId(element.anchor) : element.href;
      if (element.color) {
        var attributes = { href: href, color: element.color };
      } else {
        var attributes = { href: href };
      }
      if (element.targetFrame != null) {
        attributes.target = element.targetFrame;
      }

      var children = convertElements(element.children, messages, options);
      return [Html.nonFreshElement("a", attributes, children)];
    },
    bookmarkStart: function (element, messages, options) {
      var anchor = Html.freshElement(
        "a",
        {
          id: htmlId(element.name),
        },
        [Html.forceWrite]
      );
      return [anchor];
    },
    noteReference: function (element, messages, options) {
      noteReferences.push(element);
      var anchor = Html.freshElement(
        "span",
        {
          id: noteRefHtmlId(element),
        },
        [Html.text("[" + noteNumber++ + "]")]
      );
      // [FS] 09-02-2023
      // To prepare the foototes to be converted as InfoIcon
      if (element.noteType && element.noteType == "footnote") {
        return [Html.freshElement("sup", { id: "infoIcon" }, [anchor])];
      } else {
        return [Html.freshElement("sup", {}, [anchor])];
      }
    },
    note: function (element, messages, options) {
      // [FS] 09-02-2023
      // To prepare the foototes to be converted as InfoIcon
      if (element.noteType && element.noteType == "footnote") {
        element.body[0]["isInfoIcon"] = true;
      }
      var children = convertElements(element.body, messages, options);
      var backLink = Html.elementWithTag(
        htmlPaths.element("p", {}, { fresh: false }),
        [Html.text(" ")]
      );
      var body = children.concat([backLink]);

      return Html.freshElement("li", { id: noteHtmlId(element) }, body);
    },
    commentReference: convertCommentReference,
    comment: convertComment,
    image: deferredConversion(
      recoveringConvertImage(options.convertImage || images.dataUri)
    ),
    table: convertTable,
    tableRow: convertTableRow,
    tableCell: convertTableCell,
    break: convertBreak,
  };
  return {
    convertToHtml: convertToHtml,
  };
}

var deferredId = 1;

function deferredConversion(func) {
  return function (element, messages, options) {
    return [
      {
        type: "deferred",
        id: deferredId++,
        value: function () {
          return func(element, messages, options);
        },
      },
    ];
  };
}

function unrecognisedStyleWarning(type, element) {
  return results.warning(
    "Unrecognized " +
    type +
    " style: '" +
    element.styleName +
    "'" +
    " (Style ID: " +
    element.styleId +
    ")"
  );
}

function flatMap(values, func) {
  return _.flatten(values.map(func), true);
}

function walkHtml(nodes, callback) {
  nodes.forEach(function (node) {
    callback(node);
    if (node.children) {
      walkHtml(node.children, callback);
    }
  });
}

var commentAuthorLabel = (exports.commentAuthorLabel =
  function commentAuthorLabel(comment) {
    return comment.authorInitials || "";
  });
