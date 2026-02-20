exports.createBodyReader = createBodyReader;
exports._readNumberingProperties = readNumberingProperties;

var dingbatToUnicode = require("dingbat-to-unicode");
var _ = require("underscore");

var documents = require("../documents");
var Result = require("../results").Result;
var warning = require("../results").warning;
var uris = require("./uris");

function createBodyReader(options) {
  return {
    readXmlElement: function (element) {
      return new BodyReader(options).readXmlElement(element);
    },
    readXmlElements: function (elements) {
      return new BodyReader(options).readXmlElements(elements);
    },
  };
}

function BodyReader(options) {
  var complexFieldStack = [];
  var currentInstrText = [];

  // When a paragraph is marked as deleted, its contents should be combined
  // with the following paragraph. See 17.13.5.15 del (Deleted Paragraph) of
  // ECMA-376 4th edition Part 1.
  var deletedParagraphContents = [];

  var relationships = options.relationships;
  var contentTypes = options.contentTypes;
  var docxFile = options.docxFile;
  var files = options.files;
  var numbering = options.numbering;
  var styles = options.styles;

  function readXmlElements(elements) {
    var results = elements.map(readXmlElement);
    return combineResults(results);
  }

  function readXmlElement(element) {
    if (element.type === "element") {
      var handler = xmlElementReaders[element.name];
      if (handler) {
        return handler(element);
      } else if (
        !Object.prototype.hasOwnProperty.call(ignoreElements, element.name)
      ) {
        var message = warning(
          "An unrecognized element was ignored: " + element.name
        );
        return emptyResultWithMessages([message]);
      }
    }
    return emptyResult();
  }

  function readParagraphProperties(element) {
    return readParagraphStyle(element).map(function (style) {
      return {
        type: "paragraphProperties",
        styleId: style.styleId,
        styleName: style.name,
        alignment: element.firstOrEmpty("w:jc").attributes["w:val"],
        numbering: readNumberingProperties(
          style.styleId,
          element.firstOrEmpty("w:numPr"),
          numbering
        ),
        indent: readParagraphIndent(element.firstOrEmpty("w:ind")),
        // [FS] 09-01-2023
        // Adding Horizontal rule for Bottom Border
        bottomBorderAttributes: readBottomBorderAttributes(element),
      };
    });
  }

  function readParagraphIndent(element) {
    return {
      start: element.attributes["w:start"] || element.attributes["w:left"],
      end: element.attributes["w:end"] || element.attributes["w:right"],
      firstLine: element.attributes["w:firstLine"],
      hanging: element.attributes["w:hanging"],
    };
  }

  function readRunProperties(element) {
    return readRunStyle(element).map(function (style) {
      var fontSizeString = element.firstOrEmpty("w:sz").attributes["w:val"];
      // w:sz gives the font size in half points, so halve the value to get the size in points
      var fontSize = /^[0-9]+$/.test(fontSizeString)
        ? parseInt(fontSizeString, 10) / 2
        : null;

      return {
        type: "runProperties",
        styleId: style.styleId,
        styleName: style.name,
        verticalAlignment:
          element.firstOrEmpty("w:vertAlign").attributes["w:val"],
        font: element.firstOrEmpty("w:rFonts").attributes["w:ascii"],
        fontSize: fontSize,
        isBold: readBooleanElement(element.first("w:b")),
        isUnderline: readUnderline(element.first("w:u")),
        isItalic: readBooleanElement(element.first("w:i")),
        isStrikethrough: readBooleanElement(element.first("w:strike")),
        isAllCaps: readBooleanElement(element.first("w:caps")),
        isSmallCaps: readBooleanElement(element.first("w:smallCaps")),
        color: element.firstOrEmpty("w:color").attributes["w:val"],
        isHighlight: readBooleanElement(element.first("w:highlight")),
        highlightColor: element.firstOrEmpty("w:highlight").attributes["w:val"] //[FS]LIC-270 Adding highlight feature to mammoth
      };
    });
  }

  function readUnderline(element) {
    if (element) {
      var value = element.attributes["w:val"];
      return (
        value !== undefined &&
        value !== "false" &&
        value !== "0" &&
        value !== "none"
      );
    } else {
      return false;
    }
  }

  function readBooleanElement(element) {
    if (element) {
      var value = element.attributes["w:val"];
      return value !== "false" && value !== "0";
    } else {
      return false;
    }
  }

  function readParagraphStyle(element) {
    return readStyle(
      element,
      "w:pStyle",
      "Paragraph",
      styles.findParagraphStyleById
    );
  }

  function readRunStyle(element) {
    return readStyle(element, "w:rStyle", "Run", styles.findCharacterStyleById);
  }

  function readTableStyle(element) {
    return readStyle(element, "w:tblStyle", "Table", styles.findTableStyleById);
  }

  function readStyle(element, styleTagName, styleType, findStyleById) {
    var messages = [];
    var styleElement = element.first(styleTagName);
    var styleId = null;
    var name = null;
    if (styleElement) {
      styleId = styleElement.attributes["w:val"];

      // [FS] 11-03-2023
      // Apply Custom StyleName for Header

      // if (styleId) {
      //   var style = findStyleById(styleId);
      //   if (style) {
      //     name = style.name;
      //   } else {
      //     messages.push(undefinedStyleWarning(styleType, styleId));
      //   }
      // }
      if (styleId) {
        var style = findStyleById(styleId);
        if (style) {
          name = style.name;

          messages.push(parsedStyles(style)); //element
        } else {
          messages.push(parsedStyles(styleId));
          messages.push(undefinedStyleWarning(styleType, styleId));
        }
      }
    }
    return elementResultWithMessages(
      { styleId: styleId, name: name },
      messages
    );
  }

  var unknownComplexField = { type: "unknown" };

  function readFldChar(element) {
    var type = element.attributes["w:fldCharType"];
    if (type === "begin") {
      complexFieldStack.push(unknownComplexField);
      currentInstrText = [];
    } else if (type === "end") {
      complexFieldStack.pop();
    } else if (type === "separate") {
      var hyperlinkOptions = parseHyperlinkFieldCode(currentInstrText.join(""));
      var complexField =
        hyperlinkOptions === null
          ? unknownComplexField
          : { type: "hyperlink", options: hyperlinkOptions };
      complexFieldStack.pop();
      complexFieldStack.push(complexField);
    }
    return emptyResult();
  }

  function currentHyperlinkOptions() {
    var topHyperlink = _.last(
      complexFieldStack.filter(function (complexField) {
        return complexField.type === "hyperlink";
      })
    );
    return topHyperlink ? topHyperlink.options : null;
  }

  function parseHyperlinkFieldCode(code) {
    var externalLinkResult = /\s*HYPERLINK "(.*)"/.exec(code);
    if (externalLinkResult) {
      return { href: externalLinkResult[1] };
    }

    var internalLinkResult = /\s*HYPERLINK\s+\\l\s+"(.*)"/.exec(code);
    if (internalLinkResult) {
      return { anchor: internalLinkResult[1] };
    }

    return null;
  }

  function readInstrText(element) {
    currentInstrText.push(element.text());
    return emptyResult();
  }

  function readSymbol(element) {
    // See 17.3.3.30 sym (Symbol Character) of ECMA-376 4th edition Part 1
    var font = element.attributes["w:font"];
    var char = element.attributes["w:char"];
    var unicodeCharacter = dingbatToUnicode.hex(font, char);
    if (unicodeCharacter == null && /^F0..$/.test(char)) {
      unicodeCharacter = dingbatToUnicode.hex(font, char.substring(2));
    }

    if (unicodeCharacter == null) {
      return emptyResultWithMessages([
        warning(
          "A w:sym element with an unsupported character was ignored: char " +
            char +
            " in font " +
            font
        ),
      ]);
    } else {
      return elementResult(new documents.Text(unicodeCharacter.string));
    }
  }

  function noteReferenceReader(noteType) {
    return function (element) {
      var noteId = element.attributes["w:id"];
      return elementResult(
        new documents.NoteReference({
          noteType: noteType,
          noteId: noteId,
        })
      );
    };
  }

  function readCommentReference(element) {
    return elementResult(
      documents.commentReference({
        commentId: element.attributes["w:id"],
      })
    );
  }

  function readChildElements(element) {
    return readXmlElements(element.children);
  }

  function readBottomBorderAttributes(element) {
    if (element.children) {
      for (var i = 0; i < element.children.length; i++) {
        if (element.children[i].name === "w:pBdr") {
          for (var j = 0; j < element.children[i].children.length; j++) {
            if (element.children[i].children[j].name === "w:bottom") {
              return element.children[i].children[j].attributes;
            } else {
              return null;
            }
          }
        }
      }
    }
  }
  var xmlElementReaders = {
    "w:p": function (element) {
      var paragraphPropertiesElement = element.firstOrEmpty("w:pPr");

      var isDeleted = !!paragraphPropertiesElement
        .firstOrEmpty("w:rPr")
        .first("w:del");

      if (isDeleted) {
        element.children.forEach(function (child) {
          deletedParagraphContents.push(child);
        });
        return emptyResult();
      } else {
        var childrenXml = element.children;
        if (deletedParagraphContents.length > 0) {
          childrenXml = deletedParagraphContents.concat(childrenXml);
          deletedParagraphContents = [];
        }
        setTextBoxAttributes(element);
        return ReadResult.map(
          readParagraphProperties(paragraphPropertiesElement),
          readXmlElements(childrenXml),
          function (properties, children) {
            return new documents.Paragraph(children, properties);
          }
        ).insertExtra();
      }
    },
    "w:r": function (element) {
      return ReadResult.map(
        readRunProperties(element.firstOrEmpty("w:rPr")),
        readXmlElements(element.children),
        function (properties, children) {
          var hyperlinkOptions = currentHyperlinkOptions();
          if (hyperlinkOptions !== null) {
            children = [new documents.Hyperlink(children, hyperlinkOptions)];
          }
          // [FS]
          // ISSUE FIX: Font applied for all paragraphs
          if (
            children.length <= 1 &&
            children[0] &&
            children[0].type === "image" &&
            properties
          ) {
            properties.font = null;
            properties.fontSize = null;
            properties.isBold = false;
            properties.isUnderline = false;
            properties.isItalic = false;
            properties.isStrikethrough = false;
            properties.isAllCaps = false;
            properties.isSmallCaps = false;
            properties.font = null;
            properties.fontSize = null;
            properties.color = null;
            properties.isHighlight = null;
          }

          return new documents.Run(children, properties);
        }
      );
    },
    "w:fldChar": readFldChar,
    "w:instrText": readInstrText,
    "w:t": function (element) {
      return elementResult(new documents.Text(element.text()));
    },
    "w:tab": function (element) {
      return elementResult(new documents.Tab());
    },
    "w:noBreakHyphen": function () {
      return elementResult(new documents.Text("\u2011"));
    },
    "w:softHyphen": function (element) {
      return elementResult(new documents.Text("\u00AD"));
    },
    "w:sym": readSymbol,
    "w:hyperlink": function (element) {
      var relationshipId = element.attributes["r:id"];
      var anchor = element.attributes["w:anchor"];
      return readXmlElements(element.children).map(function (children) {
        function create(options) {
          var targetFrame = element.attributes["w:tgtFrame"] || null;

          return new documents.Hyperlink(
            children,
            _.extend({ targetFrame: targetFrame }, options)
          );
        }

        if (relationshipId) {
          var href = relationships.findTargetByRelationshipId(relationshipId);
          if (anchor) {
            href = uris.replaceFragment(href, anchor);
          }
          return create({ href: href });
        } else if (anchor) {
          return create({ anchor: anchor });
        } else {
          return children;
        }
      });
    },
    "w:tbl": readTable,
    "w:tr": readTableRow,
    "w:tc": readTableCell,
    "w:footnoteReference": noteReferenceReader("footnote"),
    "w:endnoteReference": noteReferenceReader("endnote"),
    "w:commentReference": readCommentReference,
    "w:br": function (element) {
      var breakType = element.attributes["w:type"];
      if (breakType == null || breakType === "textWrapping") {
        return elementResult(documents.lineBreak);
      } else if (breakType === "page") {
        return elementResult(documents.pageBreak);
      } else if (breakType === "column") {
        return elementResult(documents.columnBreak);
      } else {
        return emptyResultWithMessages([
          warning("Unsupported break type: " + breakType),
        ]);
      }
    },
    "w:bookmarkStart": function (element) {
      var name = element.attributes["w:name"];
      if (name === "_GoBack") {
        return emptyResult();
      } else {
        return elementResult(new documents.BookmarkStart({ name: name }));
      }
    },

    "mc:AlternateContent": function (element) {
      return readChildElements(element.first("mc:Fallback"));
    },

    "w:sdt": function (element) {
      return readXmlElements(element.firstOrEmpty("w:sdtContent").children);
    },

    "w:ins": readChildElements,
    "w:object": readChildElements,
    "w:smartTag": readChildElements,
    "w:drawing": readChildElements,
    "w:pict": function (element) {
      return readChildElements(element).toExtra();
    },
    "v:roundrect": function (element) {
      // Extract styling from v:roundrect attributes
      var fillcolor = element.attributes.fillcolor || "#DCE6F2";
      var arcsize = element.attributes.arcsize || "0.0967592592592593";

      // Extract v:stroke properties
      var strokeElement = element.first("v:stroke");
      var strokeWeight = strokeElement ? (strokeElement.attributes.weight || "1pt") : "1pt";
      var strokeColor = strokeElement ? (strokeElement.attributes.color || "#17375E") : "#17375E";

      // Extract v:fill properties
      var fillElement = element.first("v:fill");
      var fillOn = fillElement ? (fillElement.attributes.on !== "f") : true;

      // Extract dimensions from style attribute
      var style = element.attributes.style || "";
      var width = "";
      var height = "";

      if (style) {
        var styleVals = style.split(";");
        styleVals.forEach(function (val) {
          if (val.startsWith("width")) {
            width = val.split(":")[1].trim();
          }
          if (val.startsWith("height")) {
            height = val.split(":")[1].trim();
          }
        });
      }

      // Build the vignette style string
      var vignetteStyle = "";

      // Background color (only if fill is on)
      if (fillOn && fillcolor && fillcolor !== "none") {
        vignetteStyle += "background-color:" + fillcolor + ";";
      }

      // Border
      if (strokeWeight && strokeWeight !== "0pt") {
        vignetteStyle += "border:" + strokeWeight + " solid " + strokeColor + ";";
      }

      // Calculate border-radius from arcsize
      var borderRadiusValue = "15px"; 
      if (arcsize) {
        var arcsizeNum = parseFloat(arcsize);
        if (arcsizeNum > 0) {
          borderRadiusValue = Math.round(arcsizeNum * 200) + "px";
        }
      }
      vignetteStyle += "border-radius:" + borderRadiusValue + ";";

      // Dimensions
      if (width) {
        vignetteStyle += "width:" + width + ";";
      }
      if (height) {
        vignetteStyle += "min-height:" + height + ";";
      }

      // Box model and display
      vignetteStyle += "padding:15px;";
      vignetteStyle += "margin:10px 0;";
      vignetteStyle += "display:block;";
      vignetteStyle += "box-sizing:border-box;";

      // Read the children (content inside the vignette)
      var children = readChildElements(element);

      // Create a wrapper div with vignette styling
      var wrapper = {
        type: "paragraph",
        children: children.value || [],
        styleId: null,
        styleName: "vignette",
        numbering: null,
        alignment: null,
        indent: {
          start: null,
          end: null,
          firstLine: null,
          hanging: null
        },
        attributes: {
          style: vignetteStyle,
          class: "vignette-box"
        },
        attrs: null
      };

      // Return the wrapped result
      return elementResult(wrapper);
    },

    // [FS] 09-02-2023
    // Get the style properties of shape element
    "v:shape": function (element) {
      var width = "";
      var height = "";
      // var style = 'position:absolute;'
      var style = "";
      if (element.attributes.id && element.attributes.id.includes("Pic")) {
        if (element.attributes.style) {
          var styleVals = element.attributes.style.split(";");
          // var style='position:absolute;'
          styleVals.forEach(function (val) {
            if (val.startsWith("left")) {
              var l = val.split(":")[1];
              // style = style + 'left: '+ twipToPoint(l) +';';
            }
            if (val.startsWith("top")) {
              var t = val.split(":")[1];
              // style = twipToPoint(t);
            }
            if (val.startsWith("width")) {
              var w = val.split(":")[1];
              width = "width:" + twipToPoint(w) + ";";
              style = style + width;
            }
            if (val.startsWith("height")) {
              var h = val.split(":")[1];
              height = "height:" + twipToPoint(h) + ";";
              style = style + height;
            }
          });
          for (var i = 0; i < element.children.length; i++) {
            if (element.children[i].name === "v:imagedata") {
              element.children[i].attributes.style = width + height;
            }
          }
        }
      }
      var shape = readChildElements(element);
      if (element.attributes.id && element.attributes.id.includes("Pic")) {
        var np = {
          alignment: null,
          children: [],
          indent: {},
          numbering: null,
          styleId: null,
          styleName: null,
          attributes: {},
          type: "paragraph",
        };
        np.children = shape.value;
        np.attributes.style = style;
        shape.value = np;
        shape._result.value.element = np;
      }

      return shape;
    },
    // [FS] 09-02-2023
    // Manipulate the textbox properties
    "v:textbox": function (element) {
      var txtBox = readChildElements(element);
      var style = "";
      var width = "";
      var height = "";
      if (element.attributes.textbox) {
        var styleVals = element.attributes.textbox.style.split(";");
        styleVals.forEach(function (val) {
          if (val.startsWith("left")) {
            var l = val.split(":")[1];
            // style = style + 'left: '+ twipToPoint(l) +';';
          }
          if (val.startsWith("top")) {
            var t = val.split(":")[1];
            // style = twipToPoint(t);
          }
          if (val.startsWith("width")) {
            var w = val.split(":")[1];
            width = "width:" + twipToPoint(w) + ";";
            // style = style + width;
          }
          if (val.startsWith("height")) {
            var h = val.split(":")[1];
            height = "height:" + twipToPoint(h) + ";";
            // style = style + height;
          }
        });

        var txtBoxStyle = "";
        var np = {
          alignment: null,
          children: [],
          indent: {},
          numbering: null,
          styleId: null,
          styleName: null,
          attributes: {},
          type: "paragraph",
        };
        np.children = txtBox.value;
        txtBoxStyle = element.attributes.textbox.fillcolor
          ? "background-color:" +
            element.attributes.textbox.fillcolor.split(" ")[0] +
            ";"
          : "";
        if (element.attributes.textbox.strokeweight) {
          if (!element.attributes.textbox.strokecolor) {
            element.attributes.textbox.strokecolor = "black";
          }
          txtBoxStyle =
            txtBoxStyle +
            "border:" +
            element.attributes.textbox.strokeweight +
            " solid " +
            element.attributes.textbox.strokecolor.split(" ")[0] +
            ";";
        }

        if (txtBoxStyle != "") {
          np.attributes.style = "display:inline-block;" + txtBoxStyle + style;
          // np.attributes.style =   txtBoxStyle +style;
        } else {
          np.attributes.style =
            "border: 1px solid black;display:inline-block;" + style;
          // np.attributes.style =  'border: 1px solid black;display:block;' + style;
        }

        txtBox.value = np;
        txtBox._result.value.element = np;
      }

      return txtBox;
    },
    "w:txbxContent": readChildElements,
    "wp:inline": readDrawingElement,
    "wp:anchor": readDrawingElement,
    "v:imagedata": readImageData,
    // [FS] 09-02-2023
    // Handling group information
    "v:group": function (element) {
      // Simply process all children without wrapping them
      return readChildElements(element);
    },
    "v:rect": readChildElements,
  };

  return {
    readXmlElement: readXmlElement,
    readXmlElements: readXmlElements,
  };

  // [FS] 09-02-2023
  // Set paragraphs attribute to its textbox attributes to
  function setTextBoxAttributes(element) {
    if (element.children) {
      for (var index = 0; index < element.children.length; index++) {
        if (element.children[index].name === "v:textbox") {
          element.children[index].attributes.textbox = element.attributes;
          return element.attributes;
        } else {
          var attr = setTextBoxAttributes(element.children[index]);
          if (attr) {
            return attr;
          }
        }
      }
    }
  }

  // [FS] 09-02-2023
  // Read style details of elements inside a group
  function readGroupChildrenProps(group) {
    var style = "border: 1px solid";
    for (var i = 0; i < group.children.length; i++) {
      if (
        group.children[i].attributes &&
        group.children[i].attributes.id &&
        group.children[i].attributes.id.includes("AutoShape")
      ) {
        if (!group.children[i].attributes.strokecolor) {
          group.children[i].attributes.strokecolor = "black";
        }
        style =
          "border:" +
          group.children[i].attributes.strokeweight +
          " solid " +
          group.children[i].attributes.strokecolor.split(" ")[0] +
          ";";
      }
      // [FS]
      // Vignette Background Color
      if (
        group.children[i].attributes &&
        group.children[i].attributes.id &&
        group.children[i].attributes.id.includes("Text Box")
      ) {
        if (group.children[i].attributes.fillcolor) {
          style =
            style +
            "background-color:" +
            group.children[i].attributes.fillcolor.split(" ")[0] +
            ";";
        }
      }
    }
    return style;
  }

  function twipToPoint(val) {
    if (!isNaN(val)) {
      return val / 20 + "pt";
    } else {
      if (val && val.includes("pt")) {
        return val;
      }
    }
  }

  function readTable(element) {
    var propertiesResult = readTableProperties(
      element.firstOrEmpty("w:tblPr"),
      element.attributes.isCusTbl
    );
    // propertiesResult.value["isCusTable"]=element.attributes.isCusTbl;
    return readXmlElements(element.children)
      .flatMap(calculateRowSpans)
      .flatMap(function (children) {
        return propertiesResult.map(function (properties) {
          return documents.Table(children, properties);
        });
      });
  }

  function readTableProperties(element, isCusTbl) {
    return readTableStyle(element).map(function (style) {
      return {
        styleId: style.styleId,
        styleName: style.name,
        isCusTable: isCusTbl,
      };
    });
  }

  function readTableRow(element) {
    var properties = element.firstOrEmpty("w:trPr");
    var isHeader = !!properties.first("w:tblHeader");
    return readXmlElements(element.children).map(function (children) {
      return documents.TableRow(children, { isHeader: isHeader });
    });
  }

  function readTableCell(element) {
    return readXmlElements(element.children).map(function (children) {
      var properties = element.firstOrEmpty("w:tcPr");

      var gridSpan = properties.firstOrEmpty("w:gridSpan").attributes["w:val"];
      var colSpan = gridSpan ? parseInt(gridSpan, 10) : 1;

      var cell = documents.TableCell(children, {
        colSpan: colSpan,
        isLogoImg: properties.attributes.isLogoImg,
      });
      cell._vMerge = readVMerge(properties);
      return cell;
    });
  }

  function readVMerge(properties) {
    var element = properties.first("w:vMerge");
    if (element) {
      var val = element.attributes["w:val"];
      return val === "continue" || !val;
    } else {
      return null;
    }
  }

  function calculateRowSpans(rows) {
    var unexpectedNonRows = _.any(rows, function (row) {
      return row.type !== documents.types.tableRow;
    });
    if (unexpectedNonRows) {
      return elementResultWithMessages(rows, [
        warning(
          "unexpected non-row element in table, cell merging may be incorrect"
        ),
      ]);
    }
    var unexpectedNonCells = _.any(rows, function (row) {
      return _.any(row.children, function (cell) {
        return cell.type !== documents.types.tableCell;
      });
    });
    if (unexpectedNonCells) {
      return elementResultWithMessages(rows, [
        warning(
          "unexpected non-cell element in table row, cell merging may be incorrect"
        ),
      ]);
    }

    var columns = {};

    rows.forEach(function (row) {
      var cellIndex = 0;
      row.children.forEach(function (cell) {
        if (cell._vMerge && columns[cellIndex]) {
          columns[cellIndex].rowSpan++;
        } else {
          columns[cellIndex] = cell;
          cell._vMerge = false;
        }
        cellIndex += cell.colSpan;
      });
    });

    rows.forEach(function (row) {
      row.children = row.children.filter(function (cell) {
        return !cell._vMerge;
      });
      row.children.forEach(function (cell) {
        delete cell._vMerge;
      });
    });

    return elementResult(rows);
  }

  function readDrawingElement(element) {
    var blips = element
      .getElementsByTagName("a:graphic")
      .getElementsByTagName("a:graphicData")
      .getElementsByTagName("pic:pic")
      .getElementsByTagName("pic:blipFill")
      .getElementsByTagName("a:blip");

    return combineResults(blips.map(readBlip.bind(null, element)));
  }

  function readBlip(element, blip) {
    var properties = element.first("wp:docPr").attributes;
    var altText = isBlank(properties.descr)
      ? properties.title
      : properties.descr;
    var blipImageFile = findBlipImageFile(blip);
    if (blipImageFile === null) {
      return emptyResultWithMessages([
        warning("Could not find image file for a:blip element"),
      ]);
    } else {
      return readImage(blipImageFile, altText);
    }
  }

  function isBlank(value) {
    return value == null || /^\s*$/.test(value);
  }

  function findBlipImageFile(blip) {
    var embedRelationshipId = blip.attributes["r:embed"];
    var linkRelationshipId = blip.attributes["r:link"];
    if (embedRelationshipId) {
      return findEmbeddedImageFile(embedRelationshipId);
    } else if (linkRelationshipId) {
      var imagePath =
        relationships.findTargetByRelationshipId(linkRelationshipId);
      return {
        path: imagePath,
        read: files.read.bind(files, imagePath),
      };
    } else {
      return null;
    }
  }

  function readImageData(element) {
    var relationshipId = element.attributes["r:id"];

    if (relationshipId) {
      return readImage(
        findEmbeddedImageFile(relationshipId),
        element.attributes["o:title"],
        element.id
      );
    } else {
      return emptyResultWithMessages([
        warning("A v:imagedata element without a relationship ID was ignored"),
      ]);
    }
  }

  function findEmbeddedImageFile(relationshipId) {
    var path = uris.uriToZipEntryName(
      "word",
      relationships.findTargetByRelationshipId(relationshipId)
    );
    return {
      path: path,
      read: docxFile.read.bind(docxFile, path),
    };
  }

  function readImage(imageFile, altText, imgId) {
    var contentType = contentTypes.findContentType(imageFile.path);

    var image = documents.Image({
      readImage: imageFile.read,
      altText: altText,
      contentType: contentType,
      ImageId: imgId,
    });
    var warnings = supportedImageTypes[contentType]
      ? []
      : warning(
          "Image of type " +
            contentType +
            " is unlikely to display in web browsers"
        );
    return elementResultWithMessages(image, warnings);
  }

  function undefinedStyleWarning(type, styleId) {
    return warning(
      type +
        " style with ID " +
        styleId +
        " was referenced but not defined in the document"
    );
  }
  function parsedStyles(elementStyle) {
    var style = "";
    if (elementStyle.name) {
      style = elementStyle.name;
    } else if (elementStyle.styleId) {
      style = elementStyle.styleId;
    }
    return warning(
      " parsedStyles: '" +
        elementStyle.name +
        "'" +
        " (Style ID: " +
        style +
        ")"
    );
  }
}

function readNumberingProperties(styleId, element, numbering) {
  if (styleId != null) {
    var levelByStyleId = numbering.findLevelByParagraphStyleId(styleId);
    if (levelByStyleId != null) {
      return levelByStyleId;
    }
  }

  var level = element.firstOrEmpty("w:ilvl").attributes["w:val"];
  var numId = element.firstOrEmpty("w:numId").attributes["w:val"];
  if (level === undefined || numId === undefined) {
    return null;
  } else {
    return numbering.findLevel(numId, level);
  }
}

var supportedImageTypes = {
  "image/png": true,
  "image/gif": true,
  "image/jpeg": true,
  "image/svg+xml": true,
  "image/tiff": true,
};

var ignoreElements = {
  "office-word:wrap": true,
  "v:shadow": true,
  "v:shapetype": true,
  "w:annotationRef": true,
  "w:bookmarkEnd": true,
  "w:sectPr": true,
  "w:proofErr": true,
  "w:lastRenderedPageBreak": true,
  "w:commentRangeStart": true,
  "w:commentRangeEnd": true,
  "w:del": true,
  "w:footnoteRef": true,
  "w:endnoteRef": true,
  "w:pPr": true,
  "w:rPr": true,
  "w:tblPr": true,
  "w:tblGrid": true,
  "w:trPr": true,
  "w:tcPr": true,
};

function emptyResultWithMessages(messages) {
  return new ReadResult(null, null, messages);
}

function emptyResult() {
  return new ReadResult(null);
}

function elementResult(element) {
  return new ReadResult(element);
}

function elementResultWithMessages(element, messages) {
  return new ReadResult(element, null, messages);
}

function ReadResult(element, extra, messages) {
  this.value = element || [];
  this.extra = extra || [];
  this._result = new Result(
    {
      element: this.value,
      extra: extra,
    },
    messages
  );
  this.messages = this._result.messages;
}

ReadResult.prototype.toExtra = function () {
  return new ReadResult(
    null,
    joinElements(this.extra, this.value),
    this.messages
  );
};

ReadResult.prototype.insertExtra = function () {
  var extra = this.extra;
  if (extra && extra.length) {
    return new ReadResult(joinElements(this.value, extra), null, this.messages);
  } else {
    return this;
  }
};

ReadResult.prototype.map = function (func) {
  var result = this._result.map(function (value) {
    return func(value.element);
  });
  return new ReadResult(result.value, this.extra, result.messages);
};

ReadResult.prototype.flatMap = function (func) {
  var result = this._result.flatMap(function (value) {
    return func(value.element)._result;
  });
  return new ReadResult(
    result.value.element,
    joinElements(this.extra, result.value.extra),
    result.messages
  );
};

ReadResult.map = function (first, second, func) {
  return new ReadResult(
    func(first.value, second.value),
    joinElements(first.extra, second.extra),
    first.messages.concat(second.messages)
  );
};

function combineResults(results) {
  var result = Result.combine(_.pluck(results, "_result"));
  return new ReadResult(
    _.flatten(_.pluck(result.value, "element")),
    _.filter(_.flatten(_.pluck(result.value, "extra")), identity),
    result.messages
  );
}

function joinElements(first, second) {
  return _.flatten([first, second]);
}

function identity(value) {
  return value;
}
