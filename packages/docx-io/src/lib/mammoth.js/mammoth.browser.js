var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// lib/promises.ts
var require_promises = __commonJS({
  "lib/promises.ts"(exports) {
    "use strict";
    exports.defer = defer;
    exports.when = function(value) {
      return Promise.resolve(value);
    };
    exports.resolve = function(value) {
      return Promise.resolve(value);
    };
    exports.all = function(promises) {
      return Promise.all(promises);
    };
    exports.props = props;
    exports.reject = function(reason) {
      return Promise.reject(reason);
    };
    exports.promisify = promisify;
    exports.mapSeries = mapSeries;
    exports.attempt = attempt;
    exports.nfcall = function(func) {
      var args = Array.prototype.slice.call(arguments, 1);
      var promisedFunc = promisify(func);
      return promisedFunc.apply(null, args);
    };
    function promisify(func) {
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var context = this;
        return new Promise(function(resolve, reject) {
          func.apply(context, args.concat(function(error, value) {
            if (error) {
              reject(error);
            } else {
              resolve(value);
            }
          }));
        });
      };
    }
    function props(obj) {
      var keys = Object.keys(obj);
      var values = keys.map(function(key) {
        return obj[key];
      });
      return Promise.all(values).then(function(resolvedValues) {
        var result = {};
        keys.forEach(function(key, index) {
          result[key] = resolvedValues[index];
        });
        return result;
      });
    }
    function mapSeries(items, func) {
      var results = [];
      return items.reduce(function(chain, item, index) {
        return chain.then(function() {
          return Promise.resolve(func(item, index)).then(function(value) {
            results.push(value);
          });
        });
      }, Promise.resolve()).then(function() {
        return results;
      });
    }
    function attempt(func) {
      try {
        return Promise.resolve(func());
      } catch (error) {
        return Promise.reject(error);
      }
    }
    exports.also = function(promise, func) {
      return promise.then(function(value) {
        var additions = func(value);
        var merged = Object.assign({}, value, additions);
        return props(merged);
      });
    };
    function defer() {
      var resolve;
      var reject;
      var promise = new Promise(function(resolveArg, rejectArg) {
        resolve = resolveArg;
        reject = rejectArg;
      });
      return {
        resolve,
        reject,
        promise
      };
    }
  }
});

// lib/documents.ts
var require_documents = __commonJS({
  "lib/documents.ts"(exports) {
    "use strict";
    var types = exports.types = {
      document: "document",
      paragraph: "paragraph",
      run: "run",
      text: "text",
      tab: "tab",
      checkbox: "checkbox",
      hyperlink: "hyperlink",
      noteReference: "noteReference",
      image: "image",
      note: "note",
      commentReference: "commentReference",
      comment: "comment",
      commentRangeStart: "commentRangeStart",
      commentRangeEnd: "commentRangeEnd",
      inserted: "inserted",
      deleted: "deleted",
      table: "table",
      tableRow: "tableRow",
      tableCell: "tableCell",
      break: "break",
      bookmarkStart: "bookmarkStart"
    };
    function Document(children, options) {
      options = options || {};
      return {
        type: types.document,
        children,
        notes: options.notes || new Notes({}),
        comments: options.comments || []
      };
    }
    function Paragraph(children, properties) {
      properties = properties || {};
      var indent = properties.indent || {};
      return {
        type: types.paragraph,
        children,
        styleId: properties.styleId || null,
        styleName: properties.styleName || null,
        numbering: properties.numbering || null,
        alignment: properties.alignment || null,
        indent: {
          start: indent.start || null,
          end: indent.end || null,
          firstLine: indent.firstLine || null,
          hanging: indent.hanging || null
        },
        paraId: properties.paraId || null
      };
    }
    function Run(children, properties) {
      properties = properties || {};
      return {
        type: types.run,
        children,
        styleId: properties.styleId || null,
        styleName: properties.styleName || null,
        isBold: !!properties.isBold,
        isUnderline: !!properties.isUnderline,
        isItalic: !!properties.isItalic,
        isStrikethrough: !!properties.isStrikethrough,
        isAllCaps: !!properties.isAllCaps,
        isSmallCaps: !!properties.isSmallCaps,
        verticalAlignment: properties.verticalAlignment || verticalAlignment.baseline,
        font: properties.font || null,
        fontSize: properties.fontSize || null,
        highlight: properties.highlight || null
      };
    }
    var verticalAlignment = {
      baseline: "baseline",
      superscript: "superscript",
      subscript: "subscript"
    };
    function Text(value) {
      return {
        type: types.text,
        value
      };
    }
    function Tab() {
      return {
        type: types.tab
      };
    }
    function Checkbox(options) {
      return {
        type: types.checkbox,
        checked: options.checked
      };
    }
    function Hyperlink(children, options) {
      return {
        type: types.hyperlink,
        children,
        href: options.href,
        anchor: options.anchor,
        targetFrame: options.targetFrame
      };
    }
    function NoteReference(options) {
      return {
        type: types.noteReference,
        noteType: options.noteType,
        noteId: options.noteId
      };
    }
    function Notes(notes) {
      var noteValues = Array.isArray(notes) ? notes : Object.values(notes || {});
      this._notes = noteValues.reduce((indexedNotes, note) => {
        indexedNotes[noteKey(note.noteType, note.noteId)] = note;
        return indexedNotes;
      }, {});
    }
    Notes.prototype.resolve = function(reference) {
      return this.findNoteByKey(noteKey(reference.noteType, reference.noteId));
    };
    Notes.prototype.findNoteByKey = function(key) {
      return this._notes[key] || null;
    };
    function Note(options) {
      return {
        type: types.note,
        noteType: options.noteType,
        noteId: options.noteId,
        body: options.body
      };
    }
    function commentReference(options) {
      return {
        type: types.commentReference,
        commentId: options.commentId
      };
    }
    function comment(options) {
      return {
        type: types.comment,
        commentId: options.commentId,
        body: options.body,
        authorName: options.authorName || null,
        authorInitials: options.authorInitials || null,
        date: options.date || null,
        paraId: options.paraId || null,
        parentParaId: options.parentParaId || null
      };
    }
    function commentRangeStart(options) {
      return {
        type: types.commentRangeStart,
        commentId: options.commentId
      };
    }
    function commentRangeEnd(options) {
      return {
        type: types.commentRangeEnd,
        commentId: options.commentId
      };
    }
    function inserted(children, options) {
      options = options || {};
      return {
        type: types.inserted,
        children,
        author: options.author || null,
        date: options.date || null,
        changeId: options.changeId || null
      };
    }
    function deleted(children, options) {
      options = options || {};
      return {
        type: types.deleted,
        children,
        author: options.author || null,
        date: options.date || null,
        changeId: options.changeId || null
      };
    }
    function noteKey(noteType, id) {
      return noteType + "-" + id;
    }
    function Image(options) {
      return {
        type: types.image,
        // `read` is retained for backwards compatibility, but other read
        // methods should be preferred.
        read(encoding) {
          if (encoding) {
            return options.readImage(encoding);
          }
          return options.readImage().then((arrayBuffer) => Buffer.from(arrayBuffer));
        },
        readAsArrayBuffer() {
          return options.readImage();
        },
        readAsBase64String() {
          return options.readImage("base64");
        },
        readAsBuffer() {
          return options.readImage().then((arrayBuffer) => Buffer.from(arrayBuffer));
        },
        altText: options.altText,
        contentType: options.contentType
      };
    }
    function Table(children, properties) {
      properties = properties || {};
      return {
        type: types.table,
        children,
        styleId: properties.styleId || null,
        styleName: properties.styleName || null
      };
    }
    function TableRow(children, options) {
      options = options || {};
      return {
        type: types.tableRow,
        children,
        isHeader: options.isHeader || false
      };
    }
    function TableCell(children, options) {
      options = options || {};
      return {
        type: types.tableCell,
        children,
        colSpan: options.colSpan == null ? 1 : options.colSpan,
        rowSpan: options.rowSpan == null ? 1 : options.rowSpan
      };
    }
    function Break(breakType) {
      return {
        type: types["break"],
        breakType
      };
    }
    function BookmarkStart(options) {
      return {
        type: types.bookmarkStart,
        name: options.name
      };
    }
    exports.document = exports.Document = Document;
    exports.paragraph = exports.Paragraph = Paragraph;
    exports.run = exports.Run = Run;
    exports.text = exports.Text = Text;
    exports.tab = exports.Tab = Tab;
    exports.checkbox = exports.Checkbox = Checkbox;
    exports.Hyperlink = Hyperlink;
    exports.noteReference = exports.NoteReference = NoteReference;
    exports.Notes = Notes;
    exports.Note = Note;
    exports.commentReference = commentReference;
    exports.comment = comment;
    exports.commentRangeStart = commentRangeStart;
    exports.commentRangeEnd = commentRangeEnd;
    exports.inserted = inserted;
    exports.deleted = deleted;
    exports.Image = Image;
    exports.Table = Table;
    exports.TableRow = TableRow;
    exports.TableCell = TableCell;
    exports.lineBreak = Break("line");
    exports.pageBreak = Break("page");
    exports.columnBreak = Break("column");
    exports.BookmarkStart = BookmarkStart;
    exports.verticalAlignment = verticalAlignment;
  }
});

// lib/results.ts
var require_results = __commonJS({
  "lib/results.ts"(exports) {
    "use strict";
    exports.Result = Result;
    exports.success = success;
    exports.warning = warning;
    exports.error = error;
    function Result(value, messages) {
      this.value = value;
      this.messages = messages || [];
    }
    Result.prototype.map = function(func) {
      return new Result(func(this.value), this.messages);
    };
    Result.prototype.flatMap = function(func) {
      var funcResult = func(this.value);
      return new Result(funcResult.value, combineMessages([this, funcResult]));
    };
    Result.prototype.flatMapThen = function(func) {
      return func(this.value).then(
        (otherResult) => new Result(otherResult.value, combineMessages([this, otherResult]))
      );
    };
    Result.combine = (results) => {
      var values = results.map((result) => result.value).flat();
      var messages = combineMessages(results);
      return new Result(values, messages);
    };
    function success(value) {
      return new Result(value, []);
    }
    function warning(message) {
      return {
        type: "warning",
        message
      };
    }
    function error(exception) {
      return {
        type: "error",
        message: exception.message,
        error: exception
      };
    }
    function combineMessages(results) {
      var messages = [];
      results.map((result) => result.messages).flat().forEach((message) => {
        if (!containsMessage(messages, message)) {
          messages.push(message);
        }
      });
      return messages;
    }
    function containsMessage(messages, message) {
      return messages.find(isSameMessage.bind(null, message)) !== void 0;
    }
    function isSameMessage(first, second) {
      return first.type === second.type && first.message === second.message;
    }
  }
});

// lib/zipfile.ts
var require_zipfile = __commonJS({
  "lib/zipfile.ts"(exports) {
    "use strict";
    var JSZip = __require("jszip");
    exports.openArrayBuffer = openArrayBuffer;
    exports.splitPath = splitPath;
    exports.joinPath = joinPath;
    function openArrayBuffer(arrayBuffer) {
      return JSZip.loadAsync(arrayBuffer).then((zipFile) => {
        function exists(name) {
          return zipFile.file(name) !== null;
        }
        function read(name, encoding) {
          var file = zipFile.file(name);
          if (file === null) {
            return Promise.reject(new Error("File not found in ZIP: " + name));
          }
          return file.async("uint8array").then((array) => {
            if (encoding === "base64") {
              return encodeBase64(array);
            }
            if (encoding) {
              var decoder = new TextDecoder(encoding);
              return decoder.decode(array);
            }
            return array;
          });
        }
        function write(name, contents) {
          zipFile.file(name, contents);
        }
        function toArrayBuffer() {
          return zipFile.generateAsync({ type: "arraybuffer" });
        }
        return {
          exists,
          read,
          write,
          toArrayBuffer
        };
      });
    }
    function encodeBase64(array) {
      if (typeof Buffer !== "undefined") {
        return Buffer.from(array).toString("base64");
      }
      if (typeof btoa === "function") {
        var chunkSize = 32768;
        var binary = "";
        for (var index = 0; index < array.length; index += chunkSize) {
          var chunk = array.subarray(index, index + chunkSize);
          binary += String.fromCharCode.apply(null, chunk);
        }
        return btoa(binary);
      }
      throw new Error("base64 encoding is unavailable in this environment");
    }
    function splitPath(path) {
      var lastIndex = path.lastIndexOf("/");
      if (lastIndex === -1) {
        return { dirname: "", basename: path };
      }
      return {
        dirname: path.substring(0, lastIndex),
        basename: path.substring(lastIndex + 1)
      };
    }
    function joinPath() {
      var nonEmptyPaths = Array.prototype.filter.call(arguments, (path) => path);
      var relevantPaths = [];
      nonEmptyPaths.forEach((path) => {
        if (path.startsWith("/")) {
          relevantPaths = [path];
        } else {
          relevantPaths.push(path);
        }
      });
      return relevantPaths.join("/");
    }
  }
});

// lib/xml/nodes.ts
var require_nodes = __commonJS({
  "lib/xml/nodes.ts"(exports) {
    "use strict";
    exports.Element = Element;
    exports.element = (name, attributes, children) => new Element(name, attributes, children);
    exports.text = (value) => ({
      type: "text",
      value
    });
    var emptyElement = exports.emptyElement = {
      first() {
        return null;
      },
      firstOrEmpty() {
        return emptyElement;
      },
      attributes: {},
      children: []
    };
    function Element(name, attributes, children) {
      this.type = "element";
      this.name = name;
      this.attributes = attributes || {};
      this.children = children || [];
    }
    Element.prototype.first = function(name) {
      return this.children.find((child) => child.name === name);
    };
    Element.prototype.firstOrEmpty = function(name) {
      return this.first(name) || emptyElement;
    };
    Element.prototype.getElementsByTagName = function(name) {
      var elements = this.children.filter((child) => child.name === name);
      return toElementList(elements);
    };
    Element.prototype.text = function() {
      if (this.children.length === 0) {
        return "";
      }
      if (this.children.length !== 1 || this.children[0].type !== "text") {
        throw new Error("Not implemented");
      }
      return this.children[0].value;
    };
    var elementListPrototype = {
      getElementsByTagName(name) {
        return toElementList(
          this.flatMap((element) => element.getElementsByTagName(name))
        );
      }
    };
    function toElementList(array) {
      return Object.assign(array, elementListPrototype);
    }
  }
});

// lib/xml/xmldom.ts
var require_xmldom = __commonJS({
  "lib/xml/xmldom.ts"(exports) {
    "use strict";
    var xmldom = __require("@xmldom/xmldom");
    var dom = __require("@xmldom/xmldom/lib/dom");
    function parseFromString(string) {
      var errors = [];
      var domParser = new xmldom.DOMParser({
        errorHandler(level, message) {
          errors.push({ level, message });
        }
      });
      var document = domParser.parseFromString(string);
      if (errors.length === 0) {
        return document;
      }
      var errorMessages = errors.map((e) => e.level + ": " + e.message).join("\n");
      throw new Error(errorMessages);
    }
    exports.parseFromString = parseFromString;
    exports.Node = dom.Node;
  }
});

// lib/xml/reader.ts
var require_reader = __commonJS({
  "lib/xml/reader.ts"(exports) {
    "use strict";
    var promises = require_promises();
    var xmldom = require_xmldom();
    var nodes = require_nodes();
    var Element = nodes.Element;
    var xmlNamespaceUri = "http://www.w3.org/2000/xmlns/";
    exports.readString = readString;
    var Node = xmldom.Node;
    function readString(xmlString, namespaceMap) {
      namespaceMap = namespaceMap || {};
      try {
        var document = xmldom.parseFromString(xmlString, "text/xml");
      } catch (error) {
        return promises.reject(error);
      }
      if (document.documentElement.tagName === "parsererror") {
        return promises.reject(new Error(document.documentElement.textContent));
      }
      function convertNode(node) {
        switch (node.nodeType) {
          case Node.ELEMENT_NODE:
            return convertElement(node);
          case Node.TEXT_NODE:
            return nodes.text(node.nodeValue);
        }
      }
      function convertElement(element) {
        var convertedName = convertName(element);
        var convertedChildren = [];
        Array.prototype.forEach.call(element.childNodes, (childNode) => {
          var convertedNode = convertNode(childNode);
          if (convertedNode) {
            convertedChildren.push(convertedNode);
          }
        });
        var convertedAttributes = {};
        Array.prototype.forEach.call(element.attributes, (attribute) => {
          if (attribute.namespaceURI === xmlNamespaceUri) {
            return;
          }
          convertedAttributes[convertName(attribute)] = attribute.value;
        });
        return new Element(convertedName, convertedAttributes, convertedChildren);
      }
      function convertName(node) {
        if (node.namespaceURI) {
          var mappedPrefix = namespaceMap[node.namespaceURI];
          var prefix;
          if (mappedPrefix) {
            prefix = mappedPrefix + ":";
          } else {
            prefix = "{" + node.namespaceURI + "}";
          }
          return prefix + node.localName;
        }
        return node.localName;
      }
      return promises.resolve(convertNode(document.documentElement));
    }
  }
});

// lib/xml/writer.ts
var require_writer = __commonJS({
  "lib/xml/writer.ts"(exports) {
    "use strict";
    var xmlbuilder = __require("xmlbuilder");
    exports.writeString = writeString;
    var xmlNamespaceUri = "http://www.w3.org/2000/xmlns/";
    function writeString(root, namespaces) {
      var uriToPrefix = {};
      Object.keys(namespaces).forEach((prefix) => {
        uriToPrefix[namespaces[prefix]] = prefix;
      });
      var nodeWriters = {
        element: writeElement,
        text: writeTextNode
      };
      function writeNode(builder, node) {
        var writer = nodeWriters[node.type];
        if (!writer) {
          throw new Error("Unknown node type: " + node.type);
        }
        return writer(builder, node);
      }
      function writeElement(builder, element) {
        var elementBuilder = builder.element(
          mapElementName(element.name),
          element.attributes
        );
        element.children.forEach((child) => {
          writeNode(elementBuilder, child);
        });
      }
      function mapElementName(name) {
        var longFormMatch = /^\{(.*)\}(.*)$/.exec(name);
        if (longFormMatch) {
          var prefix = uriToPrefix[longFormMatch[1]];
          return prefix + (prefix === "" ? "" : ":") + longFormMatch[2];
        }
        return name;
      }
      function writeDocument(root2) {
        var builder = xmlbuilder.create(mapElementName(root2.name), {
          version: "1.0",
          encoding: "UTF-8",
          standalone: true
        });
        Object.keys(namespaces).forEach((prefix) => {
          var uri = namespaces[prefix];
          var key = "xmlns" + (prefix === "" ? "" : ":" + prefix);
          builder.attribute(key, uri);
        });
        Object.keys(root2.attributes || {}).forEach((key) => {
          if (isXmlNamespaceAttribute(key)) {
            return;
          }
          var value = root2.attributes[key];
          builder.attribute(key, value);
        });
        root2.children.forEach((child) => {
          writeNode(builder, child);
        });
        return builder.end();
      }
      return writeDocument(root);
    }
    function isXmlNamespaceAttribute(name) {
      return name === "xmlns" || name.indexOf("xmlns:") === 0 || name.indexOf("{" + xmlNamespaceUri + "}") === 0;
    }
    function writeTextNode(builder, node) {
      builder.text(node.value);
    }
  }
});

// lib/xml/index.ts
var require_xml = __commonJS({
  "lib/xml/index.ts"(exports) {
    "use strict";
    var nodes = require_nodes();
    exports.Element = nodes.Element;
    exports.element = nodes.element;
    exports.emptyElement = nodes.emptyElement;
    exports.text = nodes.text;
    exports.readString = require_reader().readString;
    exports.writeString = require_writer().writeString;
  }
});

// lib/docx/office-xml-reader.ts
var require_office_xml_reader = __commonJS({
  "lib/docx/office-xml-reader.ts"(exports) {
    "use strict";
    var promises = require_promises();
    var xml = require_xml();
    exports.read = read;
    exports.readXmlFromZipFile = readXmlFromZipFile;
    var xmlNamespaceMap = {
      // Transitional format
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main": "w",
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships": "r",
      "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing": "wp",
      "http://schemas.openxmlformats.org/drawingml/2006/main": "a",
      "http://schemas.openxmlformats.org/drawingml/2006/picture": "pic",
      // Strict format
      "http://purl.oclc.org/ooxml/wordprocessingml/main": "w",
      "http://purl.oclc.org/ooxml/officeDocument/relationships": "r",
      "http://purl.oclc.org/ooxml/drawingml/wordprocessingDrawing": "wp",
      "http://purl.oclc.org/ooxml/drawingml/main": "a",
      "http://purl.oclc.org/ooxml/drawingml/picture": "pic",
      // Common
      "http://schemas.openxmlformats.org/package/2006/content-types": "content-types",
      "http://schemas.openxmlformats.org/package/2006/relationships": "relationships",
      "http://schemas.openxmlformats.org/markup-compatibility/2006": "mc",
      "urn:schemas-microsoft-com:vml": "v",
      "urn:schemas-microsoft-com:office:word": "office-word",
      // [MS-DOCX]: Word Extensions to the Office Open XML (.docx) File Format
      // https://learn.microsoft.com/en-us/openspecs/office_standards/ms-docx/b839fe1f-e1ca-4fa6-8c26-5954d0abbccd
      "http://schemas.microsoft.com/office/word/2010/wordml": "wordml",
      // Word 2012 extensions (comments threading via commentsExtended.xml)
      "http://schemas.microsoft.com/office/word/2012/wordml": "w15",
      // Word 2016 extensions (commentsIds.xml — durable IDs)
      "http://schemas.microsoft.com/office/word/2016/wordml/cid": "w16cid",
      // Word 2018 extensions (commentsExtensible.xml — dateUtc)
      "http://schemas.microsoft.com/office/word/2018/wordml/cex": "w16cex"
    };
    function read(xmlString) {
      return xml.readString(xmlString, xmlNamespaceMap).then((document) => collapseAlternateContent(document)[0]);
    }
    function readXmlFromZipFile(docxFile, path) {
      if (docxFile.exists(path)) {
        return docxFile.read(path, "utf-8").then(stripUtf8Bom).then(read);
      }
      return promises.resolve(null);
    }
    function stripUtf8Bom(xmlString) {
      return xmlString.replace(/^\uFEFF/g, "");
    }
    function collapseAlternateContent(node) {
      if (node.type === "element") {
        if (node.name === "mc:AlternateContent") {
          return node.firstOrEmpty("mc:Fallback").children;
        }
        node.children = node.children.flatMap(collapseAlternateContent);
        return [node];
      }
      return [node];
    }
  }
});

// lib/transforms.ts
var require_transforms = __commonJS({
  "lib/transforms.ts"(exports) {
    "use strict";
    exports.paragraph = paragraph;
    exports.run = run;
    exports._elements = elements;
    exports._elementsOfType = elementsOfType;
    exports.getDescendantsOfType = getDescendantsOfType;
    exports.getDescendants = getDescendants;
    function paragraph(transform) {
      return elementsOfType("paragraph", transform);
    }
    function run(transform) {
      return elementsOfType("run", transform);
    }
    function elementsOfType(elementType, transform) {
      return elements((element) => {
        if (element.type === elementType) {
          return transform(element);
        }
        return element;
      });
    }
    function elements(transform) {
      return function transformElement(element) {
        if (element.children) {
          var children = element.children.map(transformElement);
          element = Object.assign({}, element, { children });
        }
        return transform(element);
      };
    }
    function getDescendantsOfType(element, type) {
      return getDescendants(element).filter(
        (descendant) => descendant.type === type
      );
    }
    function getDescendants(element) {
      var descendants = [];
      visitDescendants(element, (descendant) => {
        descendants.push(descendant);
      });
      return descendants;
    }
    function visitDescendants(element, visit) {
      if (element.children) {
        element.children.forEach((child) => {
          visitDescendants(child, visit);
          visit(child);
        });
      }
    }
  }
});

// lib/docx/uris.ts
var require_uris = __commonJS({
  "lib/docx/uris.ts"(exports) {
    "use strict";
    exports.uriToZipEntryName = uriToZipEntryName;
    exports.replaceFragment = replaceFragment;
    function uriToZipEntryName(base, uri) {
      if (uri.charAt(0) === "/") {
        return uri.substring(1);
      }
      return base + "/" + uri;
    }
    function replaceFragment(uri, fragment) {
      var hashIndex = uri.indexOf("#");
      if (hashIndex !== -1) {
        uri = uri.substring(0, hashIndex);
      }
      return uri + "#" + fragment;
    }
  }
});

// lib/docx/body-reader.ts
var require_body_reader = __commonJS({
  "lib/docx/body-reader.ts"(exports) {
    "use strict";
    exports.createBodyReader = createBodyReader;
    exports._readNumberingProperties = readNumberingProperties;
    var dingbatToUnicode = __require("dingbat-to-unicode");
    var documents = require_documents();
    var Result = require_results().Result;
    var warning = require_results().warning;
    var xml = require_xml();
    var transforms = require_transforms();
    var uris = require_uris();
    function createBodyReader(options) {
      return {
        readXmlElement(element) {
          return new BodyReader(options).readXmlElement(element);
        },
        readXmlElements(elements) {
          return new BodyReader(options).readXmlElements(elements);
        }
      };
    }
    function BodyReader(options) {
      var complexFieldStack = [];
      var currentInstrText = [];
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
          }
          if (!Object.hasOwn(ignoreElements, element.name)) {
            var message = warning(
              "An unrecognised element was ignored: " + element.name
            );
            return emptyResultWithMessages([message]);
          }
        }
        return emptyResult();
      }
      function readParagraphProperties(element) {
        return readParagraphStyle(element).map((style) => ({
          type: "paragraphProperties",
          styleId: style.styleId,
          styleName: style.name,
          alignment: element.firstOrEmpty("w:jc").attributes["w:val"],
          numbering: readNumberingProperties(
            style.styleId,
            element.firstOrEmpty("w:numPr"),
            numbering
          ),
          indent: readParagraphIndent(element.firstOrEmpty("w:ind"))
        }));
      }
      function readParagraphIndent(element) {
        return {
          start: element.attributes["w:start"] || element.attributes["w:left"],
          end: element.attributes["w:end"] || element.attributes["w:right"],
          firstLine: element.attributes["w:firstLine"],
          hanging: element.attributes["w:hanging"]
        };
      }
      function readRunProperties(element) {
        return readRunStyle(element).map((style) => {
          var fontSizeString = element.firstOrEmpty("w:sz").attributes["w:val"];
          var fontSize = /^[0-9]+$/.test(fontSizeString) ? Number.parseInt(fontSizeString, 10) / 2 : null;
          return {
            type: "runProperties",
            styleId: style.styleId,
            styleName: style.name,
            verticalAlignment: element.firstOrEmpty("w:vertAlign").attributes["w:val"],
            font: element.firstOrEmpty("w:rFonts").attributes["w:ascii"],
            fontSize,
            isBold: readBooleanElement(element.first("w:b")),
            isUnderline: readUnderline(element.first("w:u")),
            isItalic: readBooleanElement(element.first("w:i")),
            isStrikethrough: readBooleanElement(element.first("w:strike")),
            isAllCaps: readBooleanElement(element.first("w:caps")),
            isSmallCaps: readBooleanElement(element.first("w:smallCaps")),
            highlight: readHighlightValue(
              element.firstOrEmpty("w:highlight").attributes["w:val"]
            )
          };
        });
      }
      function readUnderline(element) {
        if (element) {
          var value = element.attributes["w:val"];
          return value !== void 0 && value !== "false" && value !== "0" && value !== "none";
        }
        return false;
      }
      function readBooleanElement(element) {
        if (element) {
          var value = element.attributes["w:val"];
          return value !== "false" && value !== "0";
        }
        return false;
      }
      function readBooleanAttributeValue(value) {
        return value !== "false" && value !== "0";
      }
      function readHighlightValue(value) {
        if (!value || value === "none") {
          return null;
        }
        return value;
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
          if (styleId) {
            var style = findStyleById(styleId);
            if (style) {
              name = style.name;
            } else {
              messages.push(undefinedStyleWarning(styleType, styleId));
            }
          }
        }
        return elementResultWithMessages({ styleId, name }, messages);
      }
      function readFldChar(element) {
        var type = element.attributes["w:fldCharType"];
        if (type === "begin") {
          complexFieldStack.push({ type: "begin", fldChar: element });
          currentInstrText = [];
        } else if (type === "end") {
          var complexFieldEnd = complexFieldStack.pop();
          if (complexFieldEnd.type === "begin") {
            complexFieldEnd = parseCurrentInstrText(complexFieldEnd);
          }
          if (complexFieldEnd.type === "checkbox") {
            return elementResult(
              documents.checkbox({
                checked: complexFieldEnd.checked
              })
            );
          }
        } else if (type === "separate") {
          var complexFieldSeparate = complexFieldStack.pop();
          var complexField = parseCurrentInstrText(complexFieldSeparate);
          complexFieldStack.push(complexField);
        }
        return emptyResult();
      }
      function currentHyperlinkOptions() {
        var hyperlinks = complexFieldStack.filter(
          (complexField) => complexField.type === "hyperlink"
        );
        var topHyperlink = hyperlinks[hyperlinks.length - 1];
        return topHyperlink ? topHyperlink.options : null;
      }
      function parseCurrentInstrText(complexField) {
        return parseInstrText(
          currentInstrText.join(""),
          complexField.type === "begin" ? complexField.fldChar : xml.emptyElement
        );
      }
      function parseInstrText(instrText, fldChar) {
        var externalLinkResult = /\s*HYPERLINK "(.*)"/.exec(instrText);
        if (externalLinkResult) {
          return { type: "hyperlink", options: { href: externalLinkResult[1] } };
        }
        var internalLinkResult = /\s*HYPERLINK\s+\\l\s+"(.*)"/.exec(instrText);
        if (internalLinkResult) {
          return { type: "hyperlink", options: { anchor: internalLinkResult[1] } };
        }
        var checkboxResult = /\s*FORMCHECKBOX\s*/.exec(instrText);
        if (checkboxResult) {
          var checkboxElement = fldChar.firstOrEmpty("w:ffData").firstOrEmpty("w:checkBox");
          var checkedElement = checkboxElement.first("w:checked");
          var checked = checkedElement == null ? readBooleanElement(checkboxElement.first("w:default")) : readBooleanElement(checkedElement);
          return { type: "checkbox", checked };
        }
        return { type: "unknown" };
      }
      function readInstrText(element) {
        currentInstrText.push(element.text());
        return emptyResult();
      }
      function readSymbol(element) {
        var font = element.attributes["w:font"];
        var char = element.attributes["w:char"];
        var unicodeCharacter = dingbatToUnicode.hex(font, char);
        if (unicodeCharacter == null && /^F0..$/.test(char)) {
          unicodeCharacter = dingbatToUnicode.hex(font, char.substring(2));
        }
        if (unicodeCharacter == null) {
          return emptyResultWithMessages([
            warning(
              "A w:sym element with an unsupported character was ignored: char " + char + " in font " + font
            )
          ]);
        }
        return elementResult(new documents.Text(unicodeCharacter.string));
      }
      function noteReferenceReader(noteType) {
        return (element) => {
          var noteId = element.attributes["w:id"];
          return elementResult(
            new documents.NoteReference({
              noteType,
              noteId
            })
          );
        };
      }
      function readCommentReference(element) {
        return elementResult(
          documents.commentReference({
            commentId: element.attributes["w:id"]
          })
        );
      }
      function readChildElements(element) {
        return readXmlElements(element.children);
      }
      var xmlElementReaders = {
        "w:p"(element) {
          var paragraphPropertiesElement = element.firstOrEmpty("w:pPr");
          var isDeleted = !!paragraphPropertiesElement.firstOrEmpty("w:rPr").first("w:del");
          if (isDeleted) {
            element.children.forEach((child) => {
              deletedParagraphContents.push(child);
            });
            return emptyResult();
          }
          var childrenXml = element.children;
          if (deletedParagraphContents.length > 0) {
            childrenXml = deletedParagraphContents.concat(childrenXml);
            deletedParagraphContents = [];
          }
          return ReadResult.map(
            readParagraphProperties(paragraphPropertiesElement),
            readXmlElements(childrenXml),
            (properties, children) => {
              properties.paraId = element.attributes["wordml:paraId"];
              return new documents.Paragraph(children, properties);
            }
          ).insertExtra();
        },
        "w:r"(element) {
          return ReadResult.map(
            readRunProperties(element.firstOrEmpty("w:rPr")),
            readXmlElements(element.children),
            (properties, children) => {
              var hyperlinkOptions = currentHyperlinkOptions();
              if (hyperlinkOptions !== null) {
                children = [new documents.Hyperlink(children, hyperlinkOptions)];
              }
              return new documents.Run(children, properties);
            }
          );
        },
        "w:fldChar": readFldChar,
        "w:instrText": readInstrText,
        "w:t"(element) {
          return elementResult(new documents.Text(element.text()));
        },
        "w:tab"(element) {
          return elementResult(new documents.Tab());
        },
        "w:noBreakHyphen"() {
          return elementResult(new documents.Text("\u2011"));
        },
        "w:softHyphen"(element) {
          return elementResult(new documents.Text("\xAD"));
        },
        "w:sym": readSymbol,
        "w:hyperlink"(element) {
          var relationshipId = element.attributes["r:id"];
          var anchor = element.attributes["w:anchor"];
          return readXmlElements(element.children).map((children) => {
            function create(options2) {
              var targetFrame = element.attributes["w:tgtFrame"] || null;
              return new documents.Hyperlink(
                children,
                Object.assign({ targetFrame }, options2)
              );
            }
            if (relationshipId) {
              var href = relationships.findTargetByRelationshipId(relationshipId);
              if (anchor) {
                href = uris.replaceFragment(href, anchor);
              }
              return create({ href });
            }
            if (anchor) {
              return create({ anchor });
            }
            return children;
          });
        },
        "w:tbl": readTable,
        "w:tr": readTableRow,
        "w:tc": readTableCell,
        "w:footnoteReference": noteReferenceReader("footnote"),
        "w:endnoteReference": noteReferenceReader("endnote"),
        "w:commentReference": readCommentReference,
        "w:br"(element) {
          var breakType = element.attributes["w:type"];
          if (breakType == null || breakType === "textWrapping") {
            return elementResult(documents.lineBreak);
          }
          if (breakType === "page") {
            return elementResult(documents.pageBreak);
          }
          if (breakType === "column") {
            return elementResult(documents.columnBreak);
          }
          return emptyResultWithMessages([
            warning("Unsupported break type: " + breakType)
          ]);
        },
        "w:bookmarkStart"(element) {
          var name = element.attributes["w:name"];
          if (name === "_GoBack") {
            return emptyResult();
          }
          return elementResult(new documents.BookmarkStart({ name }));
        },
        "mc:AlternateContent"(element) {
          return readChildElements(element.firstOrEmpty("mc:Fallback"));
        },
        "w:sdt"(element) {
          var contentResult = readXmlElements(
            element.firstOrEmpty("w:sdtContent").children
          );
          return contentResult.map((content) => {
            var checkbox = element.firstOrEmpty("w:sdtPr").first("wordml:checkbox");
            if (checkbox) {
              var checkedElement = checkbox.first("wordml:checked");
              var isChecked = !!checkedElement && readBooleanAttributeValue(checkedElement.attributes["wordml:val"]);
              var documentCheckbox = documents.checkbox({
                checked: isChecked
              });
              var hasCheckbox = false;
              var replacedContent = content.map(
                transforms._elementsOfType(documents.types.text, (text) => {
                  if (text.value.length > 0 && !hasCheckbox) {
                    hasCheckbox = true;
                    return documentCheckbox;
                  }
                  return text;
                })
              );
              if (hasCheckbox) {
                return replacedContent;
              }
              return documentCheckbox;
            }
            return content;
          });
        },
        "w:ins"(element) {
          return readChildElements(element);
        },
        "w:del"() {
          return emptyResult();
        },
        // Handle deleted text within w:del elements
        "w:delText"(element) {
          return elementResult(new documents.Text(element.text()));
        },
        "w:commentRangeStart"(element) {
          return elementResult(
            documents.commentRangeStart({
              commentId: element.attributes["w:id"]
            })
          );
        },
        "w:commentRangeEnd"(element) {
          return elementResult(
            documents.commentRangeEnd({
              commentId: element.attributes["w:id"]
            })
          );
        },
        "w:object": readChildElements,
        "w:smartTag": readChildElements,
        "w:drawing": readChildElements,
        "w:pict"(element) {
          return readChildElements(element).toExtra();
        },
        "v:roundrect": readChildElements,
        "v:shape": readChildElements,
        "v:textbox": readChildElements,
        "w:txbxContent": readChildElements,
        "wp:inline": readDrawingElement,
        "wp:anchor": readDrawingElement,
        "v:imagedata": readImageData,
        "v:group": readChildElements,
        "v:rect": readChildElements
      };
      return {
        readXmlElement,
        readXmlElements
      };
      function readTable(element) {
        var propertiesResult = readTableProperties(element.firstOrEmpty("w:tblPr"));
        return readXmlElements(element.children).flatMap(calculateRowSpans).flatMap(
          (children) => propertiesResult.map(
            (properties) => documents.Table(children, properties)
          )
        );
      }
      function readTableProperties(element) {
        return readTableStyle(element).map((style) => ({
          styleId: style.styleId,
          styleName: style.name
        }));
      }
      function readTableRow(element) {
        var properties = element.firstOrEmpty("w:trPr");
        var isDeleted = !!properties.first("w:del");
        if (isDeleted) {
          return emptyResult();
        }
        var isHeader = !!properties.first("w:tblHeader");
        return readXmlElements(element.children).map(
          (children) => documents.TableRow(children, { isHeader })
        );
      }
      function readTableCell(element) {
        return readXmlElements(element.children).map((children) => {
          var properties = element.firstOrEmpty("w:tcPr");
          var gridSpan = properties.firstOrEmpty("w:gridSpan").attributes["w:val"];
          var colSpan = gridSpan ? Number.parseInt(gridSpan, 10) : 1;
          var cell = documents.TableCell(children, { colSpan });
          cell._vMerge = readVMerge(properties);
          return cell;
        });
      }
      function readVMerge(properties) {
        var element = properties.first("w:vMerge");
        if (element) {
          var val = element.attributes["w:val"];
          return val === "continue" || !val;
        }
        return null;
      }
      function calculateRowSpans(rows) {
        var unexpectedNonRows = rows.some(
          (row) => row.type !== documents.types.tableRow
        );
        if (unexpectedNonRows) {
          removeVMergeProperties(rows);
          return elementResultWithMessages(rows, [
            warning(
              "unexpected non-row element in table, cell merging may be incorrect"
            )
          ]);
        }
        var unexpectedNonCells = rows.some(
          (row) => row.children.some((cell) => cell.type !== documents.types.tableCell)
        );
        if (unexpectedNonCells) {
          removeVMergeProperties(rows);
          return elementResultWithMessages(rows, [
            warning(
              "unexpected non-cell element in table row, cell merging may be incorrect"
            )
          ]);
        }
        var columns = {};
        rows.forEach((row) => {
          var cellIndex = 0;
          row.children.forEach((cell) => {
            if (cell._vMerge && columns[cellIndex]) {
              columns[cellIndex].rowSpan++;
            } else {
              columns[cellIndex] = cell;
              cell._vMerge = false;
            }
            cellIndex += cell.colSpan;
          });
        });
        rows.forEach((row) => {
          row.children = row.children.filter((cell) => !cell._vMerge);
          row.children.forEach((cell) => {
            delete cell._vMerge;
          });
        });
        return elementResult(rows);
      }
      function removeVMergeProperties(rows) {
        rows.forEach((row) => {
          var cells = transforms.getDescendantsOfType(
            row,
            documents.types.tableCell
          );
          cells.forEach((cell) => {
            delete cell._vMerge;
          });
        });
      }
      function readDrawingElement(element) {
        var blips = element.getElementsByTagName("a:graphic").getElementsByTagName("a:graphicData").getElementsByTagName("pic:pic").getElementsByTagName("pic:blipFill").getElementsByTagName("a:blip");
        return combineResults(blips.map(readBlip.bind(null, element)));
      }
      function readBlip(element, blip) {
        var propertiesElement = element.firstOrEmpty("wp:docPr");
        var properties = propertiesElement.attributes;
        var altText = isBlank(properties.descr) ? properties.title : properties.descr;
        var blipImageFile = findBlipImageFile(blip);
        if (blipImageFile === null) {
          return emptyResultWithMessages([
            warning("Could not find image file for a:blip element")
          ]);
        }
        return readImage(blipImageFile, altText).map((imageElement) => {
          var hlinkClickElement = propertiesElement.firstOrEmpty("a:hlinkClick");
          var relationshipId = hlinkClickElement.attributes["r:id"];
          if (relationshipId) {
            var href = relationships.findTargetByRelationshipId(relationshipId);
            return new documents.Hyperlink([imageElement], { href });
          }
          return imageElement;
        });
      }
      function isBlank(value) {
        return value == null || /^\s*$/.test(value);
      }
      function findBlipImageFile(blip) {
        var embedRelationshipId = blip.attributes["r:embed"];
        var linkRelationshipId = blip.attributes["r:link"];
        if (embedRelationshipId) {
          return findEmbeddedImageFile(embedRelationshipId);
        }
        if (linkRelationshipId) {
          var imagePath = relationships.findTargetByRelationshipId(linkRelationshipId);
          return {
            path: imagePath,
            read: files.read.bind(files, imagePath)
          };
        }
        return null;
      }
      function readImageData(element) {
        var relationshipId = element.attributes["r:id"];
        if (relationshipId) {
          return readImage(
            findEmbeddedImageFile(relationshipId),
            element.attributes["o:title"]
          );
        }
        return emptyResultWithMessages([
          warning("A v:imagedata element without a relationship ID was ignored")
        ]);
      }
      function findEmbeddedImageFile(relationshipId) {
        var path = uris.uriToZipEntryName(
          "word",
          relationships.findTargetByRelationshipId(relationshipId)
        );
        return {
          path,
          read: docxFile.read.bind(docxFile, path)
        };
      }
      function readImage(imageFile, altText) {
        var contentType = contentTypes.findContentType(imageFile.path);
        var image = documents.Image({
          readImage: imageFile.read,
          altText,
          contentType
        });
        var warnings = supportedImageTypes[contentType] ? [] : [
          warning(
            "Image of type " + contentType + " is unlikely to display in web browsers"
          )
        ];
        return elementResultWithMessages(image, warnings);
      }
      function undefinedStyleWarning(type, styleId) {
        return warning(
          type + " style with ID " + styleId + " was referenced but not defined in the document"
        );
      }
    }
    function readNumberingProperties(styleId, element, numbering) {
      var level = element.firstOrEmpty("w:ilvl").attributes["w:val"];
      var numId = element.firstOrEmpty("w:numId").attributes["w:val"];
      if (level !== void 0 && numId !== void 0) {
        return numbering.findLevel(numId, level);
      }
      if (styleId != null) {
        var levelByStyleId = numbering.findLevelByParagraphStyleId(styleId);
        if (levelByStyleId != null) {
          return levelByStyleId;
        }
      }
      if (numId !== void 0) {
        return numbering.findLevel(numId, "0");
      }
      return null;
    }
    var supportedImageTypes = {
      "image/png": true,
      "image/gif": true,
      "image/jpeg": true,
      "image/svg+xml": true,
      "image/tiff": true
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
      // w:commentRangeStart, w:commentRangeEnd are now handled by xmlElementReaders
      // w:del and w:ins are now handled by xmlElementReaders for tracked changes support
      "w:footnoteRef": true,
      "w:endnoteRef": true,
      "w:pPr": true,
      "w:rPr": true,
      "w:tblPr": true,
      "w:tblGrid": true,
      "w:trPr": true,
      "w:tcPr": true
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
          extra
        },
        messages
      );
      this.messages = this._result.messages;
    }
    ReadResult.prototype.toExtra = function() {
      return new ReadResult(
        null,
        joinElements(this.extra, this.value),
        this.messages
      );
    };
    ReadResult.prototype.insertExtra = function() {
      var extra = this.extra;
      if (extra && extra.length) {
        return new ReadResult(joinElements(this.value, extra), null, this.messages);
      }
      return this;
    };
    ReadResult.prototype.map = function(func) {
      var result = this._result.map((value) => func(value.element));
      return new ReadResult(result.value, this.extra, result.messages);
    };
    ReadResult.prototype.flatMap = function(func) {
      var result = this._result.flatMap((value) => func(value.element)._result);
      return new ReadResult(
        result.value.element,
        joinElements(this.extra, result.value.extra),
        result.messages
      );
    };
    ReadResult.map = (first, second, func) => new ReadResult(
      func(first.value, second.value),
      joinElements(first.extra, second.extra),
      first.messages.concat(second.messages)
    );
    function combineResults(results) {
      var result = Result.combine(results.map((item) => item._result));
      return new ReadResult(
        result.value.map((item) => item.element).flat(),
        result.value.map((item) => item.extra).flat().filter(identity),
        result.messages
      );
    }
    function joinElements(first, second) {
      return [first, second].flat();
    }
    function identity(value) {
      return value;
    }
  }
});

// lib/docx/document-xml-reader.ts
var require_document_xml_reader = __commonJS({
  "lib/docx/document-xml-reader.ts"(exports) {
    "use strict";
    exports.DocumentXmlReader = DocumentXmlReader;
    var documents = require_documents();
    var Result = require_results().Result;
    function DocumentXmlReader(options) {
      var bodyReader = options.bodyReader;
      function convertXmlToDocument(element) {
        var body = element.first("w:body");
        if (body == null) {
          throw new Error(
            "Could not find the body element: are you sure this is a docx file?"
          );
        }
        var result = bodyReader.readXmlElements(body.children).map(
          (children) => new documents.Document(children, {
            notes: options.notes,
            comments: options.comments
          })
        );
        return new Result(result.value, result.messages);
      }
      return {
        convertXmlToDocument
      };
    }
  }
});

// lib/docx/relationships-reader.ts
var require_relationships_reader = __commonJS({
  "lib/docx/relationships-reader.ts"(exports) {
    "use strict";
    exports.readRelationships = readRelationships;
    exports.defaultValue = new Relationships([]);
    exports.Relationships = Relationships;
    function readRelationships(element) {
      var relationships = [];
      element.children.forEach((child) => {
        if (child.name === "relationships:Relationship") {
          var relationship = {
            relationshipId: child.attributes.Id,
            target: child.attributes.Target,
            type: child.attributes.Type
          };
          relationships.push(relationship);
        }
      });
      return new Relationships(relationships);
    }
    function Relationships(relationships) {
      var targetsByRelationshipId = {};
      relationships.forEach((relationship) => {
        targetsByRelationshipId[relationship.relationshipId] = relationship.target;
      });
      var targetsByType = {};
      relationships.forEach((relationship) => {
        if (!targetsByType[relationship.type]) {
          targetsByType[relationship.type] = [];
        }
        targetsByType[relationship.type].push(relationship.target);
      });
      return {
        findTargetByRelationshipId(relationshipId) {
          return targetsByRelationshipId[relationshipId];
        },
        findTargetsByType(type) {
          return targetsByType[type] || [];
        }
      };
    }
  }
});

// lib/docx/content-types-reader.ts
var require_content_types_reader = __commonJS({
  "lib/docx/content-types-reader.ts"(exports) {
    "use strict";
    exports.readContentTypesFromXml = readContentTypesFromXml;
    var fallbackContentTypes = {
      png: "png",
      gif: "gif",
      jpeg: "jpeg",
      jpg: "jpeg",
      tif: "tiff",
      tiff: "tiff",
      bmp: "bmp"
    };
    exports.defaultContentTypes = contentTypes({}, {});
    function readContentTypesFromXml(element) {
      var extensionDefaults = {};
      var overrides = {};
      if (!element || !element.children) {
        return contentTypes(overrides, extensionDefaults);
      }
      element.children.forEach((child) => {
        if (!child || !child.attributes) return;
        if (child.name === "content-types:Default") {
          extensionDefaults[child.attributes.Extension] = child.attributes.ContentType;
        }
        if (child.name === "content-types:Override") {
          var name = child.attributes.PartName;
          if (name && name.charAt(0) === "/") {
            name = name.substring(1);
          }
          if (name) {
            overrides[name] = child.attributes.ContentType;
          }
        }
      });
      return contentTypes(overrides, extensionDefaults);
    }
    function contentTypes(overrides, extensionDefaults) {
      return {
        findContentType(path) {
          if (!path) return null;
          var overrideContentType = overrides[path];
          if (overrideContentType) {
            return overrideContentType;
          }
          var pathParts = path.split(".");
          var extension = pathParts[pathParts.length - 1];
          var extensionLower = extension.toLowerCase();
          if (Object.hasOwn(extensionDefaults, extension) || Object.hasOwn(extensionDefaults, extensionLower)) {
            return extensionDefaults[extension] || extensionDefaults[extensionLower];
          }
          var fallback = fallbackContentTypes[extensionLower];
          if (fallback) {
            return "image/" + fallback;
          }
          return null;
        }
      };
    }
  }
});

// lib/docx/numbering-xml.ts
var require_numbering_xml = __commonJS({
  "lib/docx/numbering-xml.ts"(exports) {
    "use strict";
    exports.readNumberingXml = readNumberingXml;
    exports.Numbering = Numbering;
    exports.defaultNumbering = new Numbering(
      {},
      {},
      {
        findNumberingStyleById() {
          return null;
        }
      }
    );
    function Numbering(nums, abstractNums, styles) {
      var allLevels = Object.values(abstractNums).flatMap(
        (abstractNum) => Object.values(abstractNum.levels)
      );
      var levelsByParagraphStyleId = allLevels.filter((level) => level.paragraphStyleId != null).reduce((indexedLevels, level) => {
        indexedLevels[level.paragraphStyleId] = level;
        return indexedLevels;
      }, {});
      function findLevel(numId, level) {
        var num = nums[numId];
        if (num) {
          var abstractNum = abstractNums[num.abstractNumId];
          if (!abstractNum) {
            return null;
          }
          if (abstractNum.numStyleLink == null) {
            return abstractNums[num.abstractNumId].levels[level];
          }
          var style = styles.findNumberingStyleById(abstractNum.numStyleLink);
          return findLevel(style.numId, level);
        }
        return null;
      }
      function findLevelByParagraphStyleId(styleId) {
        return levelsByParagraphStyleId[styleId] || null;
      }
      return {
        findLevel,
        findLevelByParagraphStyleId
      };
    }
    function readNumberingXml(root, options) {
      if (!options || !options.styles) {
        throw new Error("styles is missing");
      }
      var abstractNums = readAbstractNums(root);
      var nums = readNums(root, abstractNums);
      return new Numbering(nums, abstractNums, options.styles);
    }
    function readAbstractNums(root) {
      var abstractNums = {};
      root.getElementsByTagName("w:abstractNum").forEach((element) => {
        var id = element.attributes["w:abstractNumId"];
        abstractNums[id] = readAbstractNum(element);
      });
      return abstractNums;
    }
    function readAbstractNum(element) {
      var levels = {};
      var levelWithoutIndex = null;
      element.getElementsByTagName("w:lvl").forEach((levelElement) => {
        var levelIndex = levelElement.attributes["w:ilvl"];
        var numFmt = levelElement.firstOrEmpty("w:numFmt").attributes["w:val"];
        var isOrdered = numFmt !== "bullet";
        var paragraphStyleId = levelElement.firstOrEmpty("w:pStyle").attributes["w:val"];
        if (levelIndex === void 0) {
          levelWithoutIndex = {
            isOrdered,
            level: "0",
            paragraphStyleId
          };
        } else {
          levels[levelIndex] = {
            isOrdered,
            level: levelIndex,
            paragraphStyleId
          };
        }
      });
      if (levelWithoutIndex !== null && levels[levelWithoutIndex.level] === void 0) {
        levels[levelWithoutIndex.level] = levelWithoutIndex;
      }
      var numStyleLink = element.firstOrEmpty("w:numStyleLink").attributes["w:val"];
      return { levels, numStyleLink };
    }
    function readNums(root) {
      var nums = {};
      root.getElementsByTagName("w:num").forEach((element) => {
        var numId = element.attributes["w:numId"];
        var abstractNumId = element.first("w:abstractNumId").attributes["w:val"];
        nums[numId] = { abstractNumId };
      });
      return nums;
    }
  }
});

// lib/docx/styles-reader.ts
var require_styles_reader = __commonJS({
  "lib/docx/styles-reader.ts"(exports) {
    "use strict";
    exports.readStylesXml = readStylesXml;
    exports.Styles = Styles;
    exports.defaultStyles = new Styles({}, {}, {}, {});
    function Styles(paragraphStyles, characterStyles, tableStyles, numberingStyles) {
      return {
        findParagraphStyleById(styleId) {
          return paragraphStyles[styleId];
        },
        findCharacterStyleById(styleId) {
          return characterStyles[styleId];
        },
        findTableStyleById(styleId) {
          return tableStyles[styleId];
        },
        findNumberingStyleById(styleId) {
          return numberingStyles[styleId];
        }
      };
    }
    Styles.EMPTY = new Styles({}, {}, {}, {});
    function readStylesXml(root) {
      var paragraphStyles = {};
      var characterStyles = {};
      var tableStyles = {};
      var numberingStyles = {};
      var styles = {
        paragraph: paragraphStyles,
        character: characterStyles,
        table: tableStyles,
        numbering: numberingStyles
      };
      root.getElementsByTagName("w:style").forEach((styleElement) => {
        var style = readStyleElement(styleElement);
        var styleSet = styles[style.type];
        if (styleSet && styleSet[style.styleId] === void 0) {
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
    function readStyleElement(styleElement) {
      var type = styleElement.attributes["w:type"];
      if (type === "numbering") {
        return readNumberingStyleElement(type, styleElement);
      }
      var styleId = readStyleId(styleElement);
      var name = styleName(styleElement);
      return { type, styleId, name };
    }
    function styleName(styleElement) {
      var nameElement = styleElement.first("w:name");
      return nameElement ? nameElement.attributes["w:val"] : null;
    }
    function readNumberingStyleElement(type, styleElement) {
      var styleId = readStyleId(styleElement);
      var numId = styleElement.firstOrEmpty("w:pPr").firstOrEmpty("w:numPr").firstOrEmpty("w:numId").attributes["w:val"];
      return { type, numId, styleId };
    }
    function readStyleId(styleElement) {
      return styleElement.attributes["w:styleId"];
    }
  }
});

// lib/docx/notes-reader.ts
var require_notes_reader = __commonJS({
  "lib/docx/notes-reader.ts"(exports) {
    "use strict";
    var documents = require_documents();
    var Result = require_results().Result;
    exports.createFootnotesReader = createReader.bind(exports, "footnote");
    exports.createEndnotesReader = createReader.bind(exports, "endnote");
    function createReader(noteType, bodyReader) {
      function readNotesXml(element) {
        return Result.combine(
          element.getElementsByTagName("w:" + noteType).filter(isFootnoteElement).map(readFootnoteElement)
        );
      }
      function isFootnoteElement(element) {
        var type = element.attributes["w:type"];
        return type !== "continuationSeparator" && type !== "separator";
      }
      function readFootnoteElement(footnoteElement) {
        var id = footnoteElement.attributes["w:id"];
        return bodyReader.readXmlElements(footnoteElement.children).map((body) => documents.Note({ noteType, noteId: id, body }));
      }
      return readNotesXml;
    }
  }
});

// lib/docx/comments-reader.ts
var require_comments_reader = __commonJS({
  "lib/docx/comments-reader.ts"(exports) {
    "use strict";
    var documents = require_documents();
    var Result = require_results().Result;
    function createCommentsReader(bodyReader, commentsExtended, dateUtcMap) {
      commentsExtended = commentsExtended || {};
      dateUtcMap = dateUtcMap || {};
      function readCommentsXml(element) {
        return Result.combine(
          element.getElementsByTagName("w:comment").map(readCommentElement)
        );
      }
      function readCommentElement(element) {
        var id = element.attributes["w:id"];
        function readOptionalAttribute(name) {
          return (element.attributes[name] || "").trim() || null;
        }
        return bodyReader.readXmlElements(element.children).map((body) => {
          var paraId = null;
          if (body) {
            for (var i = 0; i < body.length; i++) {
              if (body[i].paraId) {
                paraId = body[i].paraId;
                break;
              }
            }
          }
          var parentParaId = paraId ? commentsExtended[paraId] : null;
          var dateFromXml = readOptionalAttribute("w:date");
          var resolvedDate = paraId && dateUtcMap[paraId] || dateFromXml;
          return documents.comment({
            commentId: id,
            body,
            authorName: readOptionalAttribute("w:author"),
            authorInitials: readOptionalAttribute("w:initials"),
            date: resolvedDate,
            paraId,
            parentParaId
          });
        });
      }
      return readCommentsXml;
    }
    exports.createCommentsReader = createCommentsReader;
  }
});

// lib/docx/comments-extended-reader.ts
var require_comments_extended_reader = __commonJS({
  "lib/docx/comments-extended-reader.ts"(exports) {
    "use strict";
    var documents = require_documents();
    var Result = require_results().Result;
    function createCommentsExtendedReader(bodyReader) {
      function readCommentsExtendedXml(element) {
        var mappings = {};
        element.children.forEach((child) => {
          if (child.name === "w15:commentEx") {
            var paraId = child.attributes["w15:paraId"];
            var parentParaId = child.attributes["w15:paraIdParent"];
            var done = child.attributes["w15:done"];
            if (paraId && parentParaId) {
              mappings[paraId] = parentParaId;
            }
          }
        });
        return new Result(mappings);
      }
      return readCommentsExtendedXml;
    }
    exports.createCommentsExtendedReader = createCommentsExtendedReader;
  }
});

// browser/docx/files.js
var require_files = __commonJS({
  "browser/docx/files.js"(exports) {
    "use strict";
    var promises = require_promises();
    exports.Files = Files;
    function Files() {
      function read(uri) {
        return promises.reject(
          new Error(
            "could not open external image: '" + uri + "'\ncannot open linked files from a web browser"
          )
        );
      }
      return {
        read
      };
    }
  }
});

// lib/docx/docx-reader.ts
var require_docx_reader = __commonJS({
  "lib/docx/docx-reader.ts"(exports) {
    "use strict";
    exports.read = read;
    exports._findPartPaths = findPartPaths;
    var promises = require_promises();
    var documents = require_documents();
    var Result = require_results().Result;
    var zipfile = require_zipfile();
    var readXmlFromZipFile = require_office_xml_reader().readXmlFromZipFile;
    var createBodyReader = require_body_reader().createBodyReader;
    var DocumentXmlReader = require_document_xml_reader().DocumentXmlReader;
    var relationshipsReader = require_relationships_reader();
    var contentTypesReader = require_content_types_reader();
    var numberingXml = require_numbering_xml();
    var stylesReader = require_styles_reader();
    var notesReader = require_notes_reader();
    var commentsReader = require_comments_reader();
    var commentsExtendedReader = require_comments_extended_reader();
    var Files = require_files().Files;
    function read(docxFile, input, options) {
      input = input || {};
      options = options || {};
      var files = new Files({
        externalFileAccess: options.externalFileAccess,
        relativeToFile: input.path
      });
      var initial = promises.props({
        contentTypes: readContentTypesFromZipFile(docxFile),
        partPaths: findPartPaths(docxFile),
        docxFile,
        files
      });
      var withStyles = promises.also(initial, (result) => ({
        styles: readStylesFromZipFile(docxFile, result.partPaths.styles)
      }));
      var withNumbering = promises.also(withStyles, (result) => ({
        numbering: readNumberingFromZipFile(
          docxFile,
          result.partPaths.numbering,
          result.styles
        )
      }));
      var withCommentsExtended = promises.also(withNumbering, (result) => ({
        commentsExtended: readXmlFromZipFile(
          result.docxFile,
          result.partPaths.commentsExtended
        ).then((xml) => {
          if (xml) {
            return commentsExtendedReader.createCommentsExtendedReader()(xml);
          }
          return new Result({});
        }),
        // Read commentsIds.xml (paraId → durableId) and
        // commentsExtensible.xml (durableId → dateUtc) to build
        // a paraId → dateUtc map for correcting Word's fake-Z dates.
        dateUtcMap: promises.props({
          idsXml: readXmlFromZipFile(
            result.docxFile,
            result.partPaths.commentsIds || "word/commentsIds.xml"
          ),
          extXml: readXmlFromZipFile(
            result.docxFile,
            result.partPaths.commentsExtensible || "word/commentsExtensible.xml"
          )
        }).then((r) => {
          var paraIdToDurable = {};
          if (r.idsXml) {
            r.idsXml.children.forEach((child) => {
              if (child.name === "w16cid:commentId") {
                var pid = child.attributes["w16cid:paraId"];
                var did = child.attributes["w16cid:durableId"];
                if (pid && did) paraIdToDurable[pid] = did;
              }
            });
          }
          var durableToDateUtc = {};
          if (r.extXml) {
            r.extXml.children.forEach((child) => {
              if (child.name === "w16cex:commentExtensible") {
                var did = child.attributes["w16cex:durableId"];
                var utc = child.attributes["w16cex:dateUtc"];
                if (did && utc) durableToDateUtc[did] = utc;
              }
            });
          }
          var map = {};
          Object.keys(paraIdToDurable).forEach((pid) => {
            var did = paraIdToDurable[pid];
            if (durableToDateUtc[did]) {
              map[pid] = durableToDateUtc[did];
            }
          });
          return new Result(map);
        })
      }));
      var withBodyParts = promises.also(withCommentsExtended, (result) => ({
        footnotes: readXmlFileWithBody(
          result.partPaths.footnotes,
          result,
          (bodyReader, xml) => {
            if (xml) {
              return notesReader.createFootnotesReader(bodyReader)(xml);
            }
            return new Result([]);
          }
        ),
        endnotes: readXmlFileWithBody(
          result.partPaths.endnotes,
          result,
          (bodyReader, xml) => {
            if (xml) {
              return notesReader.createEndnotesReader(bodyReader)(xml);
            }
            return new Result([]);
          }
        ),
        comments: readXmlFileWithBody(
          result.partPaths.comments,
          result,
          (bodyReader, xml) => {
            if (xml) {
              return commentsReader.createCommentsReader(
                bodyReader,
                result.commentsExtended.value || {},
                result.dateUtcMap.value || {}
              )(xml);
            }
            return new Result([]);
          }
        )
      }));
      var withCombinedNotes = promises.also(withBodyParts, (result) => ({
        notes: result.footnotes.flatMap(
          (footnotes) => result.endnotes.map(
            (endnotes) => new documents.Notes(footnotes.concat(endnotes))
          )
        )
      }));
      return withCombinedNotes.then(
        (result) => readXmlFileWithBody(
          result.partPaths.mainDocument,
          result,
          (bodyReader, xml) => result.notes.flatMap(
            (notes) => result.comments.flatMap((comments) => {
              var reader = new DocumentXmlReader({
                bodyReader,
                notes,
                comments
              });
              return reader.convertXmlToDocument(xml);
            })
          )
        )
      );
    }
    function findPartPaths(docxFile) {
      return readPackageRelationships(docxFile).then((packageRelationships) => {
        var mainDocumentPath = findPartPath({
          docxFile,
          relationships: packageRelationships,
          relationshipType: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
          basePath: "",
          fallbackPath: "word/document.xml"
        });
        if (!docxFile.exists(mainDocumentPath)) {
          throw new Error(
            "Could not find main document part. Are you sure this is a valid .docx file?"
          );
        }
        return xmlFileReader({
          filename: relationshipsFilename(mainDocumentPath),
          readElement: relationshipsReader.readRelationships,
          defaultValue: relationshipsReader.defaultValue
        })(docxFile).then((documentRelationships) => {
          function findPartRelatedToMainDocument(name) {
            return findPartPath({
              docxFile,
              relationships: documentRelationships,
              relationshipType: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/" + name,
              basePath: zipfile.splitPath(mainDocumentPath).dirname,
              fallbackPath: "word/" + name + ".xml"
            });
          }
          return {
            mainDocument: mainDocumentPath,
            comments: findPartRelatedToMainDocument("comments"),
            commentsExtended: findPartPath({
              docxFile,
              relationships: documentRelationships,
              relationshipType: "http://schemas.microsoft.com/office/2011/relationships/commentsExtended",
              basePath: zipfile.splitPath(mainDocumentPath).dirname,
              fallbackPath: "word/commentsExtended.xml"
            }),
            endnotes: findPartRelatedToMainDocument("endnotes"),
            footnotes: findPartRelatedToMainDocument("footnotes"),
            numbering: findPartRelatedToMainDocument("numbering"),
            styles: findPartRelatedToMainDocument("styles")
          };
        });
      });
    }
    function findPartPath(options) {
      var docxFile = options.docxFile;
      var relationships = options.relationships;
      var relationshipType = options.relationshipType;
      var basePath = options.basePath;
      var fallbackPath = options.fallbackPath;
      var targets = relationships.findTargetsByType(relationshipType);
      var normalisedTargets = targets.map(
        (target) => stripPrefix(zipfile.joinPath(basePath, target), "/")
      );
      var validTargets = normalisedTargets.filter(
        (target) => docxFile.exists(target)
      );
      if (validTargets.length === 0) {
        return fallbackPath;
      }
      return validTargets[0];
    }
    function stripPrefix(value, prefix) {
      if (value.substring(0, prefix.length) === prefix) {
        return value.substring(prefix.length);
      }
      return value;
    }
    function xmlFileReader(options) {
      return (zipFile) => readXmlFromZipFile(zipFile, options.filename).then(
        (element) => element ? options.readElement(element) : options.defaultValue
      );
    }
    function readXmlFileWithBody(filename, options, func) {
      var readRelationshipsFromZipFile = xmlFileReader({
        filename: relationshipsFilename(filename),
        readElement: relationshipsReader.readRelationships,
        defaultValue: relationshipsReader.defaultValue
      });
      return readRelationshipsFromZipFile(options.docxFile).then(
        (relationships) => {
          var bodyReader = new createBodyReader({
            relationships,
            contentTypes: options.contentTypes,
            docxFile: options.docxFile,
            numbering: options.numbering,
            styles: options.styles,
            files: options.files
          });
          return readXmlFromZipFile(options.docxFile, filename).then(
            (xml) => func(bodyReader, xml)
          );
        }
      );
    }
    function relationshipsFilename(filename) {
      var split = zipfile.splitPath(filename);
      return zipfile.joinPath(split.dirname, "_rels", split.basename + ".rels");
    }
    var readContentTypesFromZipFile = xmlFileReader({
      filename: "[Content_Types].xml",
      readElement: contentTypesReader.readContentTypesFromXml,
      defaultValue: contentTypesReader.defaultContentTypes
    });
    function readNumberingFromZipFile(zipFile, path, styles) {
      return xmlFileReader({
        filename: path,
        readElement(element) {
          return numberingXml.readNumberingXml(element, { styles });
        },
        defaultValue: numberingXml.defaultNumbering
      })(zipFile);
    }
    function readStylesFromZipFile(zipFile, path) {
      return xmlFileReader({
        filename: path,
        readElement: stylesReader.readStylesXml,
        defaultValue: stylesReader.defaultStyles
      })(zipFile);
    }
    var readPackageRelationships = xmlFileReader({
      filename: "_rels/.rels",
      readElement: relationshipsReader.readRelationships,
      defaultValue: relationshipsReader.defaultValue
    });
  }
});

// lib/docx/style-map.ts
var require_style_map = __commonJS({
  "lib/docx/style-map.ts"(exports) {
    "use strict";
    var promises = require_promises();
    var xml = require_xml();
    exports.writeStyleMap = writeStyleMap;
    exports.readStyleMap = readStyleMap;
    var schema = "http://schemas.zwobble.org/mammoth/style-map";
    var styleMapPath = "mammoth/style-map";
    var styleMapAbsolutePath = "/" + styleMapPath;
    function writeStyleMap(docxFile, styleMap) {
      docxFile.write(styleMapPath, styleMap);
      return updateRelationships(docxFile).then(() => updateContentTypes(docxFile));
    }
    function updateRelationships(docxFile) {
      var path = "word/_rels/document.xml.rels";
      var relationshipsUri = "http://schemas.openxmlformats.org/package/2006/relationships";
      var relationshipElementName = "{" + relationshipsUri + "}Relationship";
      return docxFile.read(path, "utf8").then(xml.readString).then((relationshipsContainer) => {
        var relationships = relationshipsContainer.children;
        addOrUpdateElement(relationships, relationshipElementName, "Id", {
          Id: "rMammothStyleMap",
          Type: schema,
          Target: styleMapAbsolutePath
        });
        var namespaces = { "": relationshipsUri };
        return docxFile.write(
          path,
          xml.writeString(relationshipsContainer, namespaces)
        );
      });
    }
    function updateContentTypes(docxFile) {
      var path = "[Content_Types].xml";
      var contentTypesUri = "http://schemas.openxmlformats.org/package/2006/content-types";
      var overrideName = "{" + contentTypesUri + "}Override";
      return docxFile.read(path, "utf8").then(xml.readString).then((typesElement) => {
        var children = typesElement.children;
        addOrUpdateElement(children, overrideName, "PartName", {
          PartName: styleMapAbsolutePath,
          ContentType: "text/prs.mammoth.style-map"
        });
        var namespaces = { "": contentTypesUri };
        return docxFile.write(path, xml.writeString(typesElement, namespaces));
      });
    }
    function addOrUpdateElement(elements, name, identifyingAttribute, attributes) {
      var existingElement = elements.find(
        (element) => element.name === name && element.attributes[identifyingAttribute] === attributes[identifyingAttribute]
      );
      if (existingElement) {
        existingElement.attributes = attributes;
      } else {
        elements.push(xml.element(name, attributes));
      }
    }
    function readStyleMap(docxFile) {
      if (docxFile.exists(styleMapPath)) {
        return docxFile.read(styleMapPath, "utf8");
      }
      return promises.resolve(null);
    }
  }
});

// lib/html/ast.ts
var require_ast = __commonJS({
  "lib/html/ast.ts"(exports) {
    "use strict";
    var htmlPaths = require_html_paths();
    function nonFreshElement(tagName, attributes, children) {
      return elementWithTag(
        htmlPaths.element(tagName, attributes, { fresh: false }),
        children
      );
    }
    function freshElement(tagName, attributes, children) {
      var tag = htmlPaths.element(tagName, attributes, { fresh: true });
      return elementWithTag(tag, children);
    }
    function elementWithTag(tag, children) {
      return {
        type: "element",
        tag,
        children: children || []
      };
    }
    function text(value) {
      return {
        type: "text",
        value
      };
    }
    var forceWrite = {
      type: "forceWrite"
    };
    exports.freshElement = freshElement;
    exports.nonFreshElement = nonFreshElement;
    exports.elementWithTag = elementWithTag;
    exports.text = text;
    exports.forceWrite = forceWrite;
    var voidTagNames = {
      br: true,
      hr: true,
      img: true,
      input: true
    };
    function isVoidElement(node) {
      return (!node.children || node.children.length === 0) && voidTagNames[node.tag.tagName];
    }
    exports.isVoidElement = isVoidElement;
  }
});

// lib/html/simplify.ts
var require_simplify = __commonJS({
  "lib/html/simplify.ts"(exports, module) {
    "use strict";
    var ast = require_ast();
    function simplify(nodes) {
      return collapse(removeEmpty(nodes));
    }
    function collapse(nodes) {
      var children = [];
      nodes.map(collapseNode).forEach((child) => {
        appendChild(children, child);
      });
      return children;
    }
    function collapseNode(node) {
      return collapsers[node.type](node);
    }
    var collapsers = {
      element: collapseElement,
      text: identity,
      forceWrite: identity
    };
    function collapseElement(node) {
      return ast.elementWithTag(node.tag, collapse(node.children));
    }
    function identity(value) {
      return value;
    }
    function appendChild(children, child) {
      var lastChild = children[children.length - 1];
      if (child.type === "element" && !child.tag.fresh && lastChild && lastChild.type === "element" && child.tag.matchesElement(lastChild.tag)) {
        if (child.tag.separator) {
          appendChild(lastChild.children, ast.text(child.tag.separator));
        }
        child.children.forEach((grandChild) => {
          appendChild(lastChild.children, grandChild);
        });
      } else {
        children.push(child);
      }
    }
    function removeEmpty(nodes) {
      return flatMap(nodes, (node) => emptiers[node.type](node));
    }
    function flatMap(values, func) {
      return values.flatMap(func);
    }
    var emptiers = {
      element: elementEmptier,
      text: textEmptier,
      forceWrite: neverEmpty
    };
    function neverEmpty(node) {
      return [node];
    }
    function elementEmptier(element) {
      var children = removeEmpty(element.children);
      if (children.length === 0 && !ast.isVoidElement(element)) {
        return [];
      }
      return [ast.elementWithTag(element.tag, children)];
    }
    function textEmptier(node) {
      if (node.value.length === 0) {
        return [];
      }
      return [node];
    }
    module.exports = simplify;
  }
});

// lib/html/index.ts
var require_html = __commonJS({
  "lib/html/index.ts"(exports) {
    "use strict";
    var ast = require_ast();
    exports.freshElement = ast.freshElement;
    exports.nonFreshElement = ast.nonFreshElement;
    exports.elementWithTag = ast.elementWithTag;
    exports.text = ast.text;
    exports.forceWrite = ast.forceWrite;
    exports.simplify = require_simplify();
    function write(writer, nodes) {
      nodes.forEach((node) => {
        writeNode(writer, node);
      });
    }
    function writeNode(writer, node) {
      toStrings[node.type](writer, node);
    }
    var toStrings = {
      element: generateElementString,
      text: generateTextString,
      forceWrite() {
      }
    };
    function generateElementString(writer, node) {
      if (ast.isVoidElement(node)) {
        writer.selfClosing(node.tag.tagName, node.tag.attributes);
      } else {
        writer.open(node.tag.tagName, node.tag.attributes);
        write(writer, node.children);
        writer.close(node.tag.tagName);
      }
    }
    function generateTextString(writer, node) {
      writer.text(node.value);
    }
    exports.write = write;
  }
});

// lib/styles/html-paths.ts
var require_html_paths = __commonJS({
  "lib/styles/html-paths.ts"(exports) {
    "use strict";
    var html = require_html();
    exports.topLevelElement = topLevelElement;
    exports.elements = elements;
    exports.element = element;
    function topLevelElement(tagName, attributes) {
      return elements([element(tagName, attributes, { fresh: true })]);
    }
    function elements(elementStyles) {
      return new HtmlPath(
        elementStyles.map((elementStyle) => {
          if (typeof elementStyle === "string") {
            return element(elementStyle);
          }
          return elementStyle;
        })
      );
    }
    function HtmlPath(elements2) {
      this._elements = elements2;
    }
    HtmlPath.prototype.wrap = function wrap(children) {
      var result = children();
      for (var index = this._elements.length - 1; index >= 0; index--) {
        result = this._elements[index].wrapNodes(result);
      }
      return result;
    };
    function element(tagName, attributes, options) {
      options = options || {};
      return new Element(tagName, attributes, options);
    }
    function Element(tagName, attributes, options) {
      var tagNames = {};
      if (Array.isArray(tagName)) {
        tagName.forEach((tagName2) => {
          tagNames[tagName2] = true;
        });
        tagName = tagName[0];
      } else {
        tagNames[tagName] = true;
      }
      this.tagName = tagName;
      this.tagNames = tagNames;
      this.attributes = attributes || {};
      this.fresh = options.fresh;
      this.separator = options.separator;
    }
    Element.prototype.matchesElement = function(element2) {
      return this.tagNames[element2.tagName] && areEqualAttributes(this.attributes || {}, element2.attributes || {});
    };
    Element.prototype.wrap = function wrap(generateNodes) {
      return this.wrapNodes(generateNodes());
    };
    Element.prototype.wrapNodes = function wrapNodes(nodes) {
      return [html.elementWithTag(this, nodes)];
    };
    exports.empty = elements([]);
    exports.ignore = {
      wrap() {
        return [];
      }
    };
    function areEqualAttributes(first, second) {
      var firstKeys = Object.keys(first);
      var secondKeys = Object.keys(second);
      if (firstKeys.length !== secondKeys.length) {
        return false;
      }
      return firstKeys.every((key) => first[key] === second[key]);
    }
  }
});

// lib/images.ts
var require_images = __commonJS({
  "lib/images.ts"(exports) {
    "use strict";
    var promises = require_promises();
    var Html = require_html();
    exports.imgElement = imgElement;
    function imgElement(func) {
      return (element, messages) => promises.when(func(element)).then((result) => {
        var attributes = {};
        if (element.altText) {
          attributes.alt = element.altText;
        }
        Object.assign(attributes, result);
        return [Html.freshElement("img", attributes)];
      });
    }
    exports.inline = exports.imgElement;
    exports.dataUri = imgElement(
      (element) => element.readAsBase64String().then((imageBuffer) => {
        var contentType = element.contentType || "application/octet-stream";
        return {
          src: "data:" + contentType + ";base64," + imageBuffer
        };
      })
    );
  }
});

// lib/writers/html-writer.ts
var require_html_writer = __commonJS({
  "lib/writers/html-writer.ts"(exports) {
    "use strict";
    exports.writer = writer;
    function writer(options) {
      options = options || {};
      if (options.prettyPrint) {
        return prettyWriter();
      }
      return simpleWriter();
    }
    var indentedElements = {
      div: true,
      p: true,
      ul: true,
      li: true
    };
    function prettyWriter() {
      var indentationLevel = 0;
      var indentation = "  ";
      var stack = [];
      var start = true;
      var inText = false;
      var writer2 = simpleWriter();
      function open(tagName, attributes) {
        if (indentedElements[tagName]) {
          indent();
        }
        stack.push(tagName);
        writer2.open(tagName, attributes);
        if (indentedElements[tagName]) {
          indentationLevel++;
        }
        start = false;
      }
      function close(tagName) {
        if (indentedElements[tagName]) {
          indentationLevel--;
          indent();
        }
        stack.pop();
        writer2.close(tagName);
      }
      function text(value) {
        startText();
        var currentIndent = "";
        for (var i = 0; i < indentationLevel; i++) {
          currentIndent += indentation;
        }
        var text2 = isInPre() ? value : value.replace(/\n/g, "\n" + currentIndent);
        writer2.text(text2);
      }
      function selfClosing(tagName, attributes) {
        indent();
        writer2.selfClosing(tagName, attributes);
      }
      function insideIndentedElement() {
        return stack.length === 0 || indentedElements[stack[stack.length - 1]];
      }
      function startText() {
        if (!inText) {
          indent();
          inText = true;
        }
      }
      function indent() {
        inText = false;
        if (!start && insideIndentedElement() && !isInPre()) {
          writer2._append("\n");
          for (var i = 0; i < indentationLevel; i++) {
            writer2._append(indentation);
          }
        }
      }
      function isInPre() {
        return stack.some((tagName) => tagName === "pre");
      }
      return {
        asString: writer2.asString,
        open,
        close,
        text,
        selfClosing
      };
    }
    function simpleWriter() {
      var fragments = [];
      function open(tagName, attributes) {
        var attributeString = generateAttributeString(attributes);
        fragments.push("<" + tagName + attributeString + ">");
      }
      function close(tagName) {
        fragments.push("</" + tagName + ">");
      }
      function selfClosing(tagName, attributes) {
        var attributeString = generateAttributeString(attributes);
        fragments.push("<" + tagName + attributeString + " />");
      }
      function generateAttributeString(attributes) {
        attributes = attributes || {};
        return Object.keys(attributes).map(
          (key) => " " + key + '="' + escapeHtmlAttribute(attributes[key]) + '"'
        ).join("");
      }
      function text(value) {
        fragments.push(escapeHtmlText(value));
      }
      function append(html) {
        fragments.push(html);
      }
      function asString() {
        return fragments.join("");
      }
      return {
        asString,
        open,
        close,
        text,
        selfClosing,
        _append: append
      };
    }
    function escapeHtmlText(value) {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function escapeHtmlAttribute(value) {
      return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }
});

// lib/writers/markdown-writer.ts
var require_markdown_writer = __commonJS({
  "lib/writers/markdown-writer.ts"(exports) {
    "use strict";
    function symmetricMarkdownElement(end) {
      return markdownElement(end, end);
    }
    function markdownElement(start, end) {
      return () => ({ start, end });
    }
    function markdownLink(attributes) {
      var href = attributes.href || "";
      if (href) {
        return {
          start: "[",
          end: "](" + href + ")",
          anchorPosition: "before"
        };
      }
      return {};
    }
    function markdownImage(attributes) {
      var src = attributes.src || "";
      var altText = attributes.alt || "";
      if (src || altText) {
        return { start: "![" + altText + "](" + src + ")" };
      }
      return {};
    }
    function markdownList(options) {
      return (attributes, list) => ({
        start: list ? "\n" : "",
        end: list ? "" : "\n",
        list: {
          isOrdered: options.isOrdered,
          indent: list ? list.indent + 1 : 0,
          count: 0
        }
      });
    }
    function markdownListItem(attributes, list, listItem) {
      list = list || { indent: 0, isOrdered: false, count: 0 };
      list.count++;
      listItem.hasClosed = false;
      var bullet = list.isOrdered ? list.count + "." : "-";
      var start = repeatString("	", list.indent) + bullet + " ";
      return {
        start,
        end() {
          if (!listItem.hasClosed) {
            listItem.hasClosed = true;
            return "\n";
          }
        }
      };
    }
    var htmlToMarkdown = {
      p: markdownElement("", "\n\n"),
      br: markdownElement("", "  \n"),
      ul: markdownList({ isOrdered: false }),
      ol: markdownList({ isOrdered: true }),
      li: markdownListItem,
      strong: symmetricMarkdownElement("__"),
      em: symmetricMarkdownElement("*"),
      a: markdownLink,
      img: markdownImage
    };
    (() => {
      for (var i = 1; i <= 6; i++) {
        htmlToMarkdown["h" + i] = markdownElement(
          repeatString("#", i) + " ",
          "\n\n"
        );
      }
    })();
    function repeatString(value, count) {
      return new Array(count + 1).join(value);
    }
    function markdownWriter() {
      var fragments = [];
      var elementStack = [];
      var list = null;
      var listItem = {};
      function open(tagName, attributes) {
        attributes = attributes || {};
        var createElement = htmlToMarkdown[tagName] || (() => ({}));
        var element = createElement(attributes, list, listItem);
        elementStack.push({ end: element.end, list });
        if (element.list) {
          list = element.list;
        }
        var anchorBeforeStart = element.anchorPosition === "before";
        if (anchorBeforeStart) {
          writeAnchor(attributes);
        }
        fragments.push(element.start || "");
        if (!anchorBeforeStart) {
          writeAnchor(attributes);
        }
      }
      function writeAnchor(attributes) {
        if (attributes.id) {
          fragments.push('<a id="' + attributes.id + '"></a>');
        }
      }
      function close(tagName) {
        var element = elementStack.pop();
        list = element.list;
        var end = typeof element.end === "function" ? element.end() : element.end;
        fragments.push(end || "");
      }
      function selfClosing(tagName, attributes) {
        open(tagName, attributes);
        close(tagName);
      }
      function text(value) {
        fragments.push(escapeMarkdown(value));
      }
      function asString() {
        return fragments.join("");
      }
      return {
        asString,
        open,
        close,
        text,
        selfClosing
      };
    }
    exports.writer = markdownWriter;
    function escapeMarkdown(value) {
      return value.replace(/\\/g, "\\\\").replace(/([`*_{}[\]()#+\-.!])/g, "\\$1");
    }
  }
});

// lib/writers/index.ts
var require_writers = __commonJS({
  "lib/writers/index.ts"(exports) {
    "use strict";
    var htmlWriter = require_html_writer();
    var markdownWriter = require_markdown_writer();
    exports.writer = writer;
    function writer(options) {
      options = options || {};
      if (options.outputFormat === "markdown") {
        return markdownWriter.writer();
      }
      return htmlWriter.writer(options);
    }
  }
});

// lib/document-to-html.ts
var require_document_to_html = __commonJS({
  "lib/document-to-html.ts"(exports) {
    "use strict";
    var promises = require_promises();
    var documents = require_documents();
    var htmlPaths = require_html_paths();
    var results = require_results();
    var images = require_images();
    var Html = require_html();
    var writers = require_writers();
    exports.DocumentConverter = DocumentConverter;
    var DOCX_INSERTION_START_TOKEN_PREFIX = "[[DOCX_INS_START:";
    var DOCX_INSERTION_END_TOKEN_PREFIX = "[[DOCX_INS_END:";
    var DOCX_INSERTION_TOKEN_SUFFIX = "]]";
    var DOCX_DELETION_START_TOKEN_PREFIX = "[[DOCX_DEL_START:";
    var DOCX_DELETION_END_TOKEN_PREFIX = "[[DOCX_DEL_END:";
    var DOCX_DELETION_TOKEN_SUFFIX = "]]";
    function DocumentConverter(options) {
      return {
        convertToHtml(element) {
          var comments = (element.type === documents.types.document ? element.comments : []).reduce((indexedComments, comment) => {
            indexedComments[comment.commentId] = comment;
            return indexedComments;
          }, {});
          var conversion = new DocumentConversion(options, comments);
          return conversion.convertToHtml(element);
        }
      };
    }
    function DocumentConversion(options, comments) {
      var noteNumber = 1;
      var trackedChangeIdCounter = 1;
      var noteReferences = [];
      var referencedComments = [];
      options = Object.assign({ ignoreEmptyParagraphs: true }, options);
      var idPrefix = options.idPrefix === void 0 ? "" : options.idPrefix;
      var ignoreEmptyParagraphs = options.ignoreEmptyParagraphs;
      var defaultParagraphStyle = htmlPaths.topLevelElement("p");
      var styleMap = options.styleMap || [];
      function convertToHtml(document) {
        var messages = [];
        var html = elementToHtml(document, messages, {});
        var deferredNodes = [];
        walkHtml(html, (node) => {
          if (node.type === "deferred") {
            deferredNodes.push(node);
          }
        });
        var deferredValues = {};
        return promises.mapSeries(
          deferredNodes,
          (deferred) => deferred.value().then((value) => {
            deferredValues[deferred.id] = value;
          })
        ).then(() => {
          function replaceDeferred(nodes) {
            return flatMap(nodes, (node) => {
              if (node.type === "deferred") {
                return deferredValues[node.id];
              }
              if (node.children) {
                return [
                  Object.assign({}, node, {
                    children: replaceDeferred(node.children)
                  })
                ];
              }
              return [node];
            });
          }
          var writer = writers.writer({
            prettyPrint: options.prettyPrint,
            outputFormat: options.outputFormat
          });
          Html.write(writer, Html.simplify(replaceDeferred(html)));
          return new results.Result(writer.asString(), messages);
        });
      }
      function convertElements(elements, messages, options2) {
        return flatMap(
          elements,
          (element) => elementToHtml(element, messages, options2)
        );
      }
      function elementToHtml(element, messages, options2) {
        if (!options2) {
          throw new Error("options not set");
        }
        var handler = elementConverters[element.type];
        if (handler) {
          return handler(element, messages, options2);
        }
        return [];
      }
      function convertParagraph(element, messages, options2) {
        return htmlPathForParagraph(element, messages).wrap(() => {
          var content = convertElements(element.children, messages, options2);
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
          messages.push(unrecognisedStyleWarning("paragraph", element));
        }
        return defaultParagraphStyle;
      }
      function convertRun(run, messages, options2) {
        var nodes = () => convertElements(run.children, messages, options2);
        var paths = [];
        if (run.highlight !== null) {
          var path = findHtmlPath({ type: "highlight", color: run.highlight });
          if (path) {
            paths.push(path);
          }
        }
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
        if (run.verticalAlignment === documents.verticalAlignment.superscript) {
          paths.push(htmlPaths.element("sup", {}, { fresh: false }));
        }
        if (run.isItalic) {
          paths.push(findHtmlPathForRunProperty("italic", "em"));
        }
        if (run.isBold) {
          paths.push(findHtmlPathForRunProperty("bold", "strong"));
        }
        var stylePath = htmlPaths.empty;
        var style = findStyle(run);
        if (style) {
          stylePath = style.to;
        } else if (run.styleId) {
          messages.push(unrecognisedStyleWarning("run", run));
        }
        paths.push(stylePath);
        paths.forEach((path2) => {
          nodes = path2.wrap.bind(path2, nodes);
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
        return (image, messages) => promises.attempt(() => convertImage(image, messages)).catch((error) => {
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
        return htmlId(referenceType + "-" + referenceId);
      }
      function referenceHtmlId(referenceType, referenceId) {
        return htmlId(referenceType + "-ref-" + referenceId);
      }
      function htmlId(suffix) {
        return idPrefix + suffix;
      }
      var defaultTablePath = htmlPaths.elements([
        htmlPaths.element("table", {}, { fresh: true })
      ]);
      function convertTable(element, messages, options2) {
        return findHtmlPath(element, defaultTablePath).wrap(
          () => convertTableChildren(element, messages, options2)
        );
      }
      function convertTableChildren(element, messages, options2) {
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
            Object.assign({}, options2, { isTableHeader: false })
          );
        } else {
          var headRows = convertElements(
            element.children.slice(0, bodyIndex),
            messages,
            Object.assign({}, options2, { isTableHeader: true })
          );
          var bodyRows = convertElements(
            element.children.slice(bodyIndex),
            messages,
            Object.assign({}, options2, { isTableHeader: false })
          );
          children = [
            Html.freshElement("thead", {}, headRows),
            Html.freshElement("tbody", {}, bodyRows)
          ];
        }
        return [Html.forceWrite].concat(children);
      }
      function convertTableRow(element, messages, options2) {
        var children = convertElements(element.children, messages, options2);
        return [Html.freshElement("tr", {}, [Html.forceWrite].concat(children))];
      }
      function convertTableCell(element, messages, options2) {
        var tagName = options2.isTableHeader ? "th" : "td";
        var children = convertElements(element.children, messages, options2);
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
          )
        ];
      }
      function convertCommentReference(reference, messages, options2) {
        return findHtmlPath(reference, htmlPaths.ignore).wrap(() => {
          var comment = comments[reference.commentId];
          if (!comment) {
            return [];
          }
          var count = referencedComments.length + 1;
          var label = "[" + commentAuthorLabel(comment) + count + "]";
          referencedComments.push({ label, comment });
          return [
            Html.freshElement(
              "a",
              {
                href: "#" + referentHtmlId("comment", reference.commentId),
                id: referenceHtmlId("comment", reference.commentId)
              },
              [Html.text(label)]
            )
          ];
        });
      }
      function convertComment(referencedComment, messages, options2) {
        var label = referencedComment.label;
        var comment = referencedComment.comment;
        var body = convertElements(comment.body || [], messages, options2).concat([
          Html.nonFreshElement("p", {}, [
            Html.text(" "),
            Html.freshElement(
              "a",
              { href: "#" + referenceHtmlId("comment", comment.commentId) },
              [Html.text("\u2191")]
            )
          ])
        ]);
        return [
          Html.freshElement(
            "dt",
            { id: referentHtmlId("comment", comment.commentId) },
            [Html.text("Comment " + label)]
          ),
          Html.freshElement("dd", {}, body)
        ];
      }
      function convertBreak(element, messages, options2) {
        return htmlPathForBreak(element).wrap(() => []);
      }
      function htmlPathForBreak(element) {
        var style = findStyle(element);
        if (style) {
          return style.to;
        }
        if (element.breakType === "line") {
          return htmlPaths.topLevelElement("br");
        }
        return htmlPaths.empty;
      }
      var elementConverters = {
        document(document, messages, options2) {
          var children = convertElements(document.children, messages, options2);
          var notes = noteReferences.map(
            (noteReference) => document.notes.resolve(noteReference)
          );
          var notesNodes = convertElements(notes, messages, options2);
          return children.concat([
            Html.freshElement("ol", {}, notesNodes),
            Html.freshElement(
              "dl",
              {},
              flatMap(
                referencedComments,
                (referencedComment) => convertComment(referencedComment, messages, options2)
              )
            )
          ]);
        },
        paragraph: convertParagraph,
        run: convertRun,
        text(element, messages, options2) {
          void messages;
          void options2;
          return [Html.text(element.value)];
        },
        tab(element, messages, options2) {
          return [Html.text("	")];
        },
        hyperlink(element, messages, options2) {
          var href = element.anchor ? "#" + htmlId(element.anchor) : element.href;
          var attributes = { href };
          if (element.targetFrame != null) {
            attributes.target = element.targetFrame;
          }
          var children = convertElements(element.children, messages, options2);
          return [Html.nonFreshElement("a", attributes, children)];
        },
        checkbox(element) {
          var attributes = { type: "checkbox" };
          if (element.checked) {
            attributes["checked"] = "checked";
          }
          return [Html.freshElement("input", attributes)];
        },
        bookmarkStart(element, messages, options2) {
          var anchor = Html.freshElement(
            "a",
            {
              id: htmlId(element.name)
            },
            [Html.forceWrite]
          );
          return [anchor];
        },
        noteReference(element, messages, options2) {
          void messages;
          void options2;
          noteReferences.push(element);
          var anchor = Html.freshElement(
            "a",
            {
              href: "#" + noteHtmlId(element),
              id: noteRefHtmlId(element)
            },
            [Html.text("[" + noteNumber++ + "]")]
          );
          return [Html.freshElement("sup", {}, [anchor])];
        },
        note(element, messages, options2) {
          var children = convertElements(element.body, messages, options2);
          var backLink = Html.elementWithTag(
            htmlPaths.element("p", {}, { fresh: false }),
            [
              Html.text(" "),
              Html.freshElement("a", { href: "#" + noteRefHtmlId(element) }, [
                Html.text("\u2191")
              ])
            ]
          );
          var body = children.concat([backLink]);
          return Html.freshElement("li", { id: noteHtmlId(element) }, body);
        },
        commentReference: convertCommentReference,
        comment: convertComment,
        commentRangeStart(element, messages, options2) {
          void element;
          void messages;
          void options2;
          return [];
        },
        commentRangeEnd(element, messages, options2) {
          void element;
          void messages;
          void options2;
          return [];
        },
        inserted(element, messages, options2) {
          var children = convertElements(element.children, messages, options2);
          var changeId = element.changeId || "ins-" + trackedChangeIdCounter++;
          var payload = encodeTrackedChangePayload({
            id: changeId,
            author: element.author,
            date: element.date
          });
          var startToken = DOCX_INSERTION_START_TOKEN_PREFIX + payload + DOCX_INSERTION_TOKEN_SUFFIX;
          var endToken = DOCX_INSERTION_END_TOKEN_PREFIX + changeId + DOCX_INSERTION_TOKEN_SUFFIX;
          return [Html.text(startToken)].concat(children).concat([Html.text(endToken)]);
        },
        deleted(element, messages, options2) {
          var children = convertElements(element.children, messages, options2);
          var changeId = element.changeId || "del-" + trackedChangeIdCounter++;
          var payload = encodeTrackedChangePayload({
            id: changeId,
            author: element.author,
            date: element.date
          });
          var startToken = DOCX_DELETION_START_TOKEN_PREFIX + payload + DOCX_DELETION_TOKEN_SUFFIX;
          var endToken = DOCX_DELETION_END_TOKEN_PREFIX + changeId + DOCX_DELETION_TOKEN_SUFFIX;
          return [Html.text(startToken)].concat(children).concat([Html.text(endToken)]);
        },
        image: deferredConversion(
          recoveringConvertImage(options.convertImage || images.dataUri)
        ),
        table: convertTable,
        tableRow: convertTableRow,
        tableCell: convertTableCell,
        break: convertBreak
      };
      return {
        convertToHtml
      };
    }
    var deferredId = 1;
    function encodeTrackedChangePayload(payload) {
      return encodeURIComponent(JSON.stringify(payload));
    }
    function deferredConversion(func) {
      return (element, messages, options) => [
        {
          type: "deferred",
          id: deferredId++,
          value() {
            return func(element, messages, options);
          }
        }
      ];
    }
    function unrecognisedStyleWarning(type, element) {
      return results.warning(
        "Unrecognised " + type + " style: '" + element.styleName + "' (Style ID: " + element.styleId + ")"
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
    var commentAuthorLabel = exports.commentAuthorLabel = function commentAuthorLabel2(comment) {
      return comment.authorInitials || "";
    };
  }
});

// lib/raw-text.ts
var require_raw_text = __commonJS({
  "lib/raw-text.ts"(exports) {
    "use strict";
    var documents = require_documents();
    function convertElementToRawText(element) {
      if (element.type === "text") {
        return element.value;
      }
      if (element.type === documents.types.tab) {
        return "	";
      }
      var tail = element.type === "paragraph" ? "\n\n" : "";
      return (element.children || []).map(convertElementToRawText).join("") + tail;
    }
    exports.convertElementToRawText = convertElementToRawText;
  }
});

// lib/vendor/lop/lib/TokenIterator.ts
var require_TokenIterator = __commonJS({
  "lib/vendor/lop/lib/TokenIterator.ts"(exports, module) {
    "use strict";
    var TokenIterator = module.exports = function(tokens, startIndex) {
      this._tokens = tokens;
      this._startIndex = startIndex || 0;
    };
    TokenIterator.prototype.head = function() {
      return this._tokens[this._startIndex];
    };
    TokenIterator.prototype.tail = function(startIndex) {
      return new TokenIterator(this._tokens, this._startIndex + 1);
    };
    TokenIterator.prototype.toArray = function() {
      return this._tokens.slice(this._startIndex);
    };
    TokenIterator.prototype.end = function() {
      return this._tokens[this._tokens.length - 1];
    };
    TokenIterator.prototype.to = function(end) {
      var start = this.head().source;
      var endToken = end.head() || end.end();
      return start.to(endToken.source);
    };
  }
});

// lib/vendor/lop/lib/parser.ts
var require_parser = __commonJS({
  "lib/vendor/lop/lib/parser.ts"(exports) {
    "use strict";
    var TokenIterator = require_TokenIterator();
    exports.Parser = function(options) {
      var parseTokens = function(parser, tokens) {
        return parser(new TokenIterator(tokens));
      };
      return {
        parseTokens
      };
    };
  }
});

// lib/vendor/lop/lib/option.ts
var require_option = __commonJS({
  "lib/vendor/lop/lib/option.ts"(exports) {
    "use strict";
    var nonePrototype = {
      value: function() {
        throw new Error("Called value on none");
      },
      isNone: function() {
        return true;
      },
      isSome: function() {
        return false;
      },
      map: function() {
        return exports.none;
      },
      flatMap: function() {
        return exports.none;
      },
      filter: function() {
        return exports.none;
      },
      toArray: function() {
        return [];
      },
      orElse: callOrReturn,
      valueOrElse: callOrReturn
    };
    exports.none = Object.create(nonePrototype);
    function callOrReturn(value) {
      if (typeof value === "function") {
        return value();
      }
      return value;
    }
    exports.some = function(value) {
      return new Some(value);
    };
    function Some(value) {
      this._value = value;
    }
    Some.prototype.value = function() {
      return this._value;
    };
    Some.prototype.isNone = function() {
      return false;
    };
    Some.prototype.isSome = function() {
      return true;
    };
    Some.prototype.map = function(func) {
      return new Some(func(this._value));
    };
    Some.prototype.flatMap = function(func) {
      return func(this._value);
    };
    Some.prototype.filter = function(predicate) {
      return predicate(this._value) ? this : exports.none;
    };
    Some.prototype.toArray = function() {
      return [this._value];
    };
    Some.prototype.orElse = function() {
      return this;
    };
    Some.prototype.valueOrElse = function() {
      return this._value;
    };
    exports.isOption = function(value) {
      return value === exports.none || value instanceof Some;
    };
    exports.fromNullable = function(value) {
      if (value == null) {
        return exports.none;
      }
      return new Some(value);
    };
  }
});

// lib/vendor/lop/lib/parsing-results.ts
var require_parsing_results = __commonJS({
  "lib/vendor/lop/lib/parsing-results.ts"(exports, module) {
    "use strict";
    module.exports = {
      failure: function(errors, remaining) {
        if (errors.length < 1) {
          throw new Error("Failure must have errors");
        }
        return new Result({
          status: "failure",
          remaining,
          errors
        });
      },
      error: function(errors, remaining) {
        if (errors.length < 1) {
          throw new Error("Failure must have errors");
        }
        return new Result({
          status: "error",
          remaining,
          errors
        });
      },
      success: function(value, remaining, source) {
        return new Result({
          status: "success",
          value,
          source,
          remaining,
          errors: []
        });
      },
      cut: function(remaining) {
        return new Result({
          status: "cut",
          remaining,
          errors: []
        });
      }
    };
    var Result = function(options) {
      this._value = options.value;
      this._status = options.status;
      this._hasValue = options.value !== void 0;
      this._remaining = options.remaining;
      this._source = options.source;
      this._errors = options.errors;
    };
    Result.prototype.map = function(func) {
      if (this._hasValue) {
        return new Result({
          value: func(this._value, this._source),
          status: this._status,
          remaining: this._remaining,
          source: this._source,
          errors: this._errors
        });
      } else {
        return this;
      }
    };
    Result.prototype.changeRemaining = function(remaining) {
      return new Result({
        value: this._value,
        status: this._status,
        remaining,
        source: this._source,
        errors: this._errors
      });
    };
    Result.prototype.isSuccess = function() {
      return this._status === "success" || this._status === "cut";
    };
    Result.prototype.isFailure = function() {
      return this._status === "failure";
    };
    Result.prototype.isError = function() {
      return this._status === "error";
    };
    Result.prototype.isCut = function() {
      return this._status === "cut";
    };
    Result.prototype.value = function() {
      return this._value;
    };
    Result.prototype.remaining = function() {
      return this._remaining;
    };
    Result.prototype.source = function() {
      return this._source;
    };
    Result.prototype.errors = function() {
      return this._errors;
    };
  }
});

// lib/vendor/lop/lib/errors.ts
var require_errors = __commonJS({
  "lib/vendor/lop/lib/errors.ts"(exports) {
    "use strict";
    exports.error = function(options) {
      return new Error2(options);
    };
    var Error2 = function(options) {
      this.expected = options.expected;
      this.actual = options.actual;
      this._location = options.location;
    };
    Error2.prototype.describe = function() {
      var locationDescription = this._location ? this._location.describe() + ":\n" : "";
      return locationDescription + "Expected " + this.expected + "\nbut got " + this.actual;
    };
    Error2.prototype.lineNumber = function() {
      return this._location.lineNumber();
    };
    Error2.prototype.characterNumber = function() {
      return this._location.characterNumber();
    };
  }
});

// lib/vendor/lop/lib/lazy-iterators.ts
var require_lazy_iterators = __commonJS({
  "lib/vendor/lop/lib/lazy-iterators.ts"(exports) {
    "use strict";
    var fromArray = exports.fromArray = function(array) {
      var index = 0;
      var hasNext = function() {
        return index < array.length;
      };
      return new LazyIterator({
        hasNext,
        next: function() {
          if (!hasNext()) {
            throw new Error("No more elements");
          } else {
            return array[index++];
          }
        }
      });
    };
    var LazyIterator = function(iterator) {
      this._iterator = iterator;
    };
    LazyIterator.prototype.map = function(func) {
      var iterator = this._iterator;
      return new LazyIterator({
        hasNext: function() {
          return iterator.hasNext();
        },
        next: function() {
          return func(iterator.next());
        }
      });
    };
    LazyIterator.prototype.filter = function(condition) {
      var iterator = this._iterator;
      var moved = false;
      var hasNext = false;
      var next;
      var moveIfNecessary = function() {
        if (moved) {
          return;
        }
        moved = true;
        hasNext = false;
        while (iterator.hasNext() && !hasNext) {
          next = iterator.next();
          hasNext = condition(next);
        }
      };
      return new LazyIterator({
        hasNext: function() {
          moveIfNecessary();
          return hasNext;
        },
        next: function() {
          moveIfNecessary();
          var toReturn = next;
          moved = false;
          return toReturn;
        }
      });
    };
    LazyIterator.prototype.first = function() {
      var iterator = this._iterator;
      if (this._iterator.hasNext()) {
        return iterator.next();
      } else {
        return null;
      }
    };
    LazyIterator.prototype.toArray = function() {
      var result = [];
      while (this._iterator.hasNext()) {
        result.push(this._iterator.next());
      }
      return result;
    };
  }
});

// lib/vendor/lop/lib/rules.ts
var require_rules = __commonJS({
  "lib/vendor/lop/lib/rules.ts"(exports) {
    "use strict";
    var options = require_option();
    var results = require_parsing_results();
    var errors = require_errors();
    var lazyIterators = require_lazy_iterators();
    exports.token = function(tokenType, value) {
      var matchValue = value !== void 0;
      return function(input) {
        var token = input.head();
        if (token && token.name === tokenType && (!matchValue || token.value === value)) {
          return results.success(token.value, input.tail(), token.source);
        } else {
          var expected = describeToken({ name: tokenType, value });
          return describeTokenMismatch(input, expected);
        }
      };
    };
    exports.tokenOfType = function(tokenType) {
      return exports.token(tokenType);
    };
    exports.firstOf = function(name, parsers) {
      if (!Array.isArray(parsers)) {
        parsers = Array.prototype.slice.call(arguments, 1);
      }
      return function(input) {
        return lazyIterators.fromArray(parsers).map(function(parser) {
          return parser(input);
        }).filter(function(result) {
          return result.isSuccess() || result.isError();
        }).first() || describeTokenMismatch(input, name);
      };
    };
    exports.then = function(parser, func) {
      return function(input) {
        var result = parser(input);
        if (!result.map) {
          console.log(result);
        }
        return result.map(func);
      };
    };
    exports.sequence = function() {
      var parsers = Array.prototype.slice.call(arguments, 0);
      var rule = function(input) {
        var result = parsers.reduce(function(memo, parser) {
          var result2 = memo.result;
          var hasCut = memo.hasCut;
          if (!result2.isSuccess()) {
            return { result: result2, hasCut };
          }
          var subResult = parser(result2.remaining());
          if (subResult.isCut()) {
            return { result: result2, hasCut: true };
          } else if (subResult.isSuccess()) {
            var values;
            if (parser.isCaptured) {
              values = result2.value().withValue(parser, subResult.value());
            } else {
              values = result2.value();
            }
            var remaining = subResult.remaining();
            var source2 = input.to(remaining);
            return {
              result: results.success(values, remaining, source2),
              hasCut
            };
          } else if (hasCut) {
            return { result: results.error(subResult.errors(), subResult.remaining()), hasCut };
          } else {
            return { result: subResult, hasCut };
          }
        }, { result: results.success(new SequenceValues(), input), hasCut: false }).result;
        var source = input.to(result.remaining());
        return result.map(function(values) {
          return values.withValue(exports.sequence.source, source);
        });
      };
      rule.head = function() {
        var firstCapture = parsers.find(isCapturedRule);
        return exports.then(
          rule,
          exports.sequence.extract(firstCapture)
        );
      };
      rule.map = function(func) {
        return exports.then(
          rule,
          function(result) {
            return func.apply(this, result.toArray());
          }
        );
      };
      function isCapturedRule(subRule) {
        return subRule.isCaptured;
      }
      return rule;
    };
    var SequenceValues = function(values, valuesArray) {
      this._values = values || {};
      this._valuesArray = valuesArray || [];
    };
    SequenceValues.prototype.withValue = function(rule, value) {
      if (rule.captureName && rule.captureName in this._values) {
        throw new Error('Cannot add second value for capture "' + rule.captureName + '"');
      } else {
        var newValues = Object.assign({}, this._values);
        newValues[rule.captureName] = value;
        var newValuesArray = this._valuesArray.concat([value]);
        return new SequenceValues(newValues, newValuesArray);
      }
    };
    SequenceValues.prototype.get = function(rule) {
      if (rule.captureName in this._values) {
        return this._values[rule.captureName];
      } else {
        throw new Error('No value for capture "' + rule.captureName + '"');
      }
    };
    SequenceValues.prototype.toArray = function() {
      return this._valuesArray;
    };
    exports.sequence.capture = function(rule, name) {
      var captureRule = function() {
        return rule.apply(this, arguments);
      };
      captureRule.captureName = name;
      captureRule.isCaptured = true;
      return captureRule;
    };
    exports.sequence.extract = function(rule) {
      return function(result) {
        return result.get(rule);
      };
    };
    exports.sequence.applyValues = function(func) {
      var rules = Array.prototype.slice.call(arguments, 1);
      return function(result) {
        var values = rules.map(function(rule) {
          return result.get(rule);
        });
        return func.apply(this, values);
      };
    };
    exports.sequence.source = {
      captureName: "\u2603source\u2603"
    };
    exports.sequence.cut = function() {
      return function(input) {
        return results.cut(input);
      };
    };
    exports.optional = function(rule) {
      return function(input) {
        var result = rule(input);
        if (result.isSuccess()) {
          return result.map(options.some);
        } else if (result.isFailure()) {
          return results.success(options.none, input);
        } else {
          return result;
        }
      };
    };
    exports.zeroOrMoreWithSeparator = function(rule, separator) {
      return repeatedWithSeparator(rule, separator, false);
    };
    exports.oneOrMoreWithSeparator = function(rule, separator) {
      return repeatedWithSeparator(rule, separator, true);
    };
    var zeroOrMore = exports.zeroOrMore = function(rule) {
      return function(input) {
        var values = [];
        var result;
        while ((result = rule(input)) && result.isSuccess()) {
          input = result.remaining();
          values.push(result.value());
        }
        if (result.isError()) {
          return result;
        } else {
          return results.success(values, input);
        }
      };
    };
    exports.oneOrMore = function(rule) {
      return exports.oneOrMoreWithSeparator(rule, noOpRule);
    };
    function noOpRule(input) {
      return results.success(null, input);
    }
    var repeatedWithSeparator = function(rule, separator, isOneOrMore) {
      return function(input) {
        var result = rule(input);
        if (result.isSuccess()) {
          var mainRule = exports.sequence.capture(rule, "main");
          var remainingRule = zeroOrMore(exports.then(
            exports.sequence(separator, mainRule),
            exports.sequence.extract(mainRule)
          ));
          var remainingResult = remainingRule(result.remaining());
          return results.success([result.value()].concat(remainingResult.value()), remainingResult.remaining());
        } else if (isOneOrMore || result.isError()) {
          return result;
        } else {
          return results.success([], input);
        }
      };
    };
    exports.leftAssociative = function(leftRule, rightRule, func) {
      var rights;
      if (func) {
        rights = [{ func, rule: rightRule }];
      } else {
        rights = rightRule;
      }
      rights = rights.map(function(right) {
        return exports.then(right.rule, function(rightValue) {
          return function(leftValue, source) {
            return right.func(leftValue, rightValue, source);
          };
        });
      });
      var repeatedRule = exports.firstOf.apply(null, ["rules"].concat(rights));
      return function(input) {
        var start = input;
        var leftResult = leftRule(input);
        if (!leftResult.isSuccess()) {
          return leftResult;
        }
        var repeatedResult = repeatedRule(leftResult.remaining());
        while (repeatedResult.isSuccess()) {
          var remaining = repeatedResult.remaining();
          var source = start.to(repeatedResult.remaining());
          var right = repeatedResult.value();
          leftResult = results.success(
            right(leftResult.value(), source),
            remaining,
            source
          );
          repeatedResult = repeatedRule(leftResult.remaining());
        }
        if (repeatedResult.isError()) {
          return repeatedResult;
        }
        return leftResult;
      };
    };
    exports.leftAssociative.firstOf = function() {
      return Array.prototype.slice.call(arguments, 0);
    };
    exports.nonConsuming = function(rule) {
      return function(input) {
        return rule(input).changeRemaining(input);
      };
    };
    var describeToken = function(token) {
      if (token.value) {
        return token.name + ' "' + token.value + '"';
      } else {
        return token.name;
      }
    };
    function describeTokenMismatch(input, expected) {
      var error;
      var token = input.head();
      if (token) {
        error = errors.error({
          expected,
          actual: describeToken(token),
          location: token.source
        });
      } else {
        error = errors.error({
          expected,
          actual: "end of tokens"
        });
      }
      return results.failure([error], input);
    }
  }
});

// lib/vendor/lop/lib/StringSource.ts
var require_StringSource = __commonJS({
  "lib/vendor/lop/lib/StringSource.ts"(exports, module) {
    "use strict";
    var StringSource = module.exports = function(string, description) {
      var self = {
        asString: function() {
          return string;
        },
        range: function(startIndex, endIndex) {
          return new StringSourceRange(string, description, startIndex, endIndex);
        }
      };
      return self;
    };
    var StringSourceRange = function(string, description, startIndex, endIndex) {
      this._string = string;
      this._description = description;
      this._startIndex = startIndex;
      this._endIndex = endIndex;
    };
    StringSourceRange.prototype.to = function(otherRange) {
      return new StringSourceRange(this._string, this._description, this._startIndex, otherRange._endIndex);
    };
    StringSourceRange.prototype.describe = function() {
      var position = this._position();
      var description = this._description ? this._description + "\n" : "";
      return description + "Line number: " + position.lineNumber + "\nCharacter number: " + position.characterNumber;
    };
    StringSourceRange.prototype.lineNumber = function() {
      return this._position().lineNumber;
    };
    StringSourceRange.prototype.characterNumber = function() {
      return this._position().characterNumber;
    };
    StringSourceRange.prototype._position = function() {
      var self = this;
      var index = 0;
      var nextNewLine = function() {
        return self._string.indexOf("\n", index);
      };
      var lineNumber = 1;
      while (nextNewLine() !== -1 && nextNewLine() < this._startIndex) {
        index = nextNewLine() + 1;
        lineNumber += 1;
      }
      var characterNumber = this._startIndex - index + 1;
      return { lineNumber, characterNumber };
    };
  }
});

// lib/vendor/lop/lib/Token.ts
var require_Token = __commonJS({
  "lib/vendor/lop/lib/Token.ts"(exports, module) {
    "use strict";
    module.exports = function(name, value, source) {
      this.name = name;
      this.value = value;
      if (source) {
        this.source = source;
      }
    };
  }
});

// lib/vendor/lop/lib/bottom-up.ts
var require_bottom_up = __commonJS({
  "lib/vendor/lop/lib/bottom-up.ts"(exports) {
    "use strict";
    var rules = require_rules();
    var results = require_parsing_results();
    exports.parser = function(name, prefixRules, infixRuleBuilders) {
      var self = {
        rule,
        leftAssociative,
        rightAssociative
      };
      var infixRules = new InfixRules(infixRuleBuilders.map(createInfixRule));
      var prefixRule = rules.firstOf(name, prefixRules);
      function createInfixRule(infixRuleBuilder) {
        return {
          name: infixRuleBuilder.name,
          rule: lazyRule(infixRuleBuilder.ruleBuilder.bind(null, self))
        };
      }
      function rule() {
        return createRule(infixRules);
      }
      function leftAssociative(name2) {
        return createRule(infixRules.untilExclusive(name2));
      }
      function rightAssociative(name2) {
        return createRule(infixRules.untilInclusive(name2));
      }
      function createRule(infixRules2) {
        return apply.bind(null, infixRules2);
      }
      function apply(infixRules2, tokens) {
        var leftResult = prefixRule(tokens);
        if (leftResult.isSuccess()) {
          return infixRules2.apply(leftResult);
        } else {
          return leftResult;
        }
      }
      return self;
    };
    function InfixRules(infixRules) {
      function untilExclusive(name) {
        return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name)));
      }
      function untilInclusive(name) {
        return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name) + 1));
      }
      function ruleNames() {
        return infixRules.map(function(rule) {
          return rule.name;
        });
      }
      function apply(leftResult) {
        var currentResult;
        var source;
        while (true) {
          currentResult = applyToTokens(leftResult.remaining());
          if (currentResult.isSuccess()) {
            source = leftResult.source().to(currentResult.source());
            leftResult = results.success(
              currentResult.value()(leftResult.value(), source),
              currentResult.remaining(),
              source
            );
          } else if (currentResult.isFailure()) {
            return leftResult;
          } else {
            return currentResult;
          }
        }
      }
      function applyToTokens(tokens) {
        return rules.firstOf("infix", infixRules.map(function(infix) {
          return infix.rule;
        }))(tokens);
      }
      return {
        apply,
        untilExclusive,
        untilInclusive
      };
    }
    exports.infix = function(name, ruleBuilder) {
      function map(func) {
        return exports.infix(name, function(parser) {
          var rule = ruleBuilder(parser);
          return function(tokens) {
            var result = rule(tokens);
            return result.map(function(right) {
              return function(left, source) {
                return func(left, right, source);
              };
            });
          };
        });
      }
      return {
        name,
        ruleBuilder,
        map
      };
    };
    var lazyRule = function(ruleBuilder) {
      var rule;
      return function(input) {
        if (!rule) {
          rule = ruleBuilder();
        }
        return rule(input);
      };
    };
  }
});

// lib/vendor/lop/lib/regex-tokeniser.ts
var require_regex_tokeniser = __commonJS({
  "lib/vendor/lop/lib/regex-tokeniser.ts"(exports) {
    "use strict";
    var Token = require_Token();
    var StringSource = require_StringSource();
    exports.RegexTokeniser = RegexTokeniser;
    function RegexTokeniser(rules) {
      rules = rules.map(function(rule) {
        return {
          name: rule.name,
          regex: new RegExp(rule.regex.source, "g")
        };
      });
      function tokenise(input, description) {
        var source = new StringSource(input, description);
        var index = 0;
        var tokens = [];
        while (index < input.length) {
          var result = readNextToken(input, index, source);
          index = result.endIndex;
          tokens.push(result.token);
        }
        tokens.push(endToken(input, source));
        return tokens;
      }
      function readNextToken(string, startIndex, source) {
        for (var i = 0; i < rules.length; i++) {
          var regex = rules[i].regex;
          regex.lastIndex = startIndex;
          var result = regex.exec(string);
          if (result) {
            var endIndex = startIndex + result[0].length;
            if (result.index === startIndex && endIndex > startIndex) {
              var value = result[1];
              var token = new Token(
                rules[i].name,
                value,
                source.range(startIndex, endIndex)
              );
              return { token, endIndex };
            }
          }
        }
        var endIndex = startIndex + 1;
        var token = new Token(
          "unrecognisedCharacter",
          string.substring(startIndex, endIndex),
          source.range(startIndex, endIndex)
        );
        return { token, endIndex };
      }
      function endToken(input, source) {
        return new Token(
          "end",
          null,
          source.range(input.length, input.length)
        );
      }
      return {
        tokenise
      };
    }
  }
});

// lib/vendor/lop/index.ts
var require_lop = __commonJS({
  "lib/vendor/lop/index.ts"(exports) {
    "use strict";
    exports.Parser = require_parser().Parser;
    exports.rules = require_rules();
    exports.errors = require_errors();
    exports.results = require_parsing_results();
    exports.StringSource = require_StringSource();
    exports.Token = require_Token();
    exports.bottomUp = require_bottom_up();
    exports.RegexTokeniser = require_regex_tokeniser().RegexTokeniser;
    exports.rule = function(ruleBuilder) {
      var rule;
      return function(input) {
        if (!rule) {
          rule = ruleBuilder();
        }
        return rule(input);
      };
    };
  }
});

// lib/styles/document-matchers.ts
var require_document_matchers = __commonJS({
  "lib/styles/document-matchers.ts"(exports) {
    "use strict";
    exports.paragraph = paragraph;
    exports.run = run;
    exports.table = table;
    exports.bold = new Matcher("bold");
    exports.italic = new Matcher("italic");
    exports.underline = new Matcher("underline");
    exports.strikethrough = new Matcher("strikethrough");
    exports.allCaps = new Matcher("allCaps");
    exports.smallCaps = new Matcher("smallCaps");
    exports.highlight = highlight;
    exports.commentReference = new Matcher("commentReference");
    exports.commentRangeStart = new Matcher("commentRangeStart");
    exports.commentRangeEnd = new Matcher("commentRangeEnd");
    exports.inserted = new Matcher("inserted");
    exports.deleted = new Matcher("deleted");
    exports.lineBreak = new BreakMatcher({ breakType: "line" });
    exports.pageBreak = new BreakMatcher({ breakType: "page" });
    exports.columnBreak = new BreakMatcher({ breakType: "column" });
    exports.equalTo = equalTo;
    exports.startsWith = startsWith;
    function paragraph(options) {
      return new Matcher("paragraph", options);
    }
    function run(options) {
      return new Matcher("run", options);
    }
    function table(options) {
      return new Matcher("table", options);
    }
    function highlight(options) {
      return new HighlightMatcher(options);
    }
    function Matcher(elementType, options) {
      options = options || {};
      this._elementType = elementType;
      this._styleId = options.styleId;
      this._styleName = options.styleName;
      if (options.list) {
        this._listIndex = options.list.levelIndex;
        this._listIsOrdered = options.list.isOrdered;
      }
    }
    Matcher.prototype.matches = function(element) {
      return element.type === this._elementType && (this._styleId === void 0 || element.styleId === this._styleId) && (this._styleName === void 0 || element.styleName && this._styleName.operator(
        this._styleName.operand,
        element.styleName
      )) && (this._listIndex === void 0 || isList(element, this._listIndex, this._listIsOrdered));
    };
    function HighlightMatcher(options) {
      options = options || {};
      this._color = options.color;
    }
    HighlightMatcher.prototype.matches = function(element) {
      return element.type === "highlight" && (this._color === void 0 || element.color === this._color);
    };
    function BreakMatcher(options) {
      options = options || {};
      this._breakType = options.breakType;
    }
    BreakMatcher.prototype.matches = function(element) {
      return element.type === "break" && (this._breakType === void 0 || element.breakType === this._breakType);
    };
    function isList(element, levelIndex, isOrdered) {
      return element.numbering && element.numbering.level == levelIndex && element.numbering.isOrdered == isOrdered;
    }
    function equalTo(value) {
      return {
        operator: operatorEqualTo,
        operand: value
      };
    }
    function startsWith(value) {
      return {
        operator: operatorStartsWith,
        operand: value
      };
    }
    function operatorEqualTo(first, second) {
      return first.toUpperCase() === second.toUpperCase();
    }
    function operatorStartsWith(first, second) {
      return second.toUpperCase().indexOf(first.toUpperCase()) === 0;
    }
  }
});

// lib/styles/parser/tokeniser.ts
var require_tokeniser = __commonJS({
  "lib/styles/parser/tokeniser.ts"(exports) {
    "use strict";
    var lop = require_lop();
    var RegexTokeniser = lop.RegexTokeniser;
    exports.tokenise = tokenise;
    var stringPrefix = "'((?:\\\\.|[^'])*)";
    function tokenise(string) {
      var identifierCharacter = "(?:[a-zA-Z\\-_]|\\\\.)";
      var tokeniser = new RegexTokeniser([
        {
          name: "identifier",
          regex: new RegExp(
            "(" + identifierCharacter + "(?:" + identifierCharacter + "|[0-9])*)"
          )
        },
        { name: "dot", regex: /\./ },
        { name: "colon", regex: /:/ },
        { name: "gt", regex: />/ },
        { name: "whitespace", regex: /\s+/ },
        { name: "arrow", regex: /=>/ },
        { name: "equals", regex: /=/ },
        { name: "startsWith", regex: /\^=/ },
        { name: "open-paren", regex: /\(/ },
        { name: "close-paren", regex: /\)/ },
        { name: "open-square-bracket", regex: /\[/ },
        { name: "close-square-bracket", regex: /\]/ },
        { name: "string", regex: new RegExp(stringPrefix + "'") },
        { name: "unterminated-string", regex: new RegExp(stringPrefix) },
        { name: "integer", regex: /([0-9]+)/ },
        { name: "choice", regex: /\|/ },
        { name: "bang", regex: /(!)/ }
      ]);
      return tokeniser.tokenise(string);
    }
  }
});

// lib/style-reader.ts
var require_style_reader = __commonJS({
  "lib/style-reader.ts"(exports) {
    "use strict";
    var lop = require_lop();
    var documentMatchers = require_document_matchers();
    var htmlPaths = require_html_paths();
    var tokenise = require_tokeniser().tokenise;
    var results = require_results();
    exports.readHtmlPath = readHtmlPath;
    exports.readDocumentMatcher = readDocumentMatcher;
    exports.readStyle = readStyle;
    function readStyle(string) {
      return parseString(styleRule, string);
    }
    function createStyleRule() {
      return lop.rules.sequence(
        lop.rules.sequence.capture(documentMatcherRule()),
        lop.rules.tokenOfType("whitespace"),
        lop.rules.tokenOfType("arrow"),
        lop.rules.sequence.capture(
          lop.rules.optional(
            lop.rules.sequence(
              lop.rules.tokenOfType("whitespace"),
              lop.rules.sequence.capture(htmlPathRule())
            ).head()
          )
        ),
        lop.rules.tokenOfType("end")
      ).map((documentMatcher, htmlPath) => ({
        from: documentMatcher,
        to: htmlPath.valueOrElse(htmlPaths.empty)
      }));
    }
    function readDocumentMatcher(string) {
      return parseString(documentMatcherRule(), string);
    }
    function documentMatcherRule() {
      var sequence = lop.rules.sequence;
      var identifierToConstant = (identifier, constant) => lop.rules.then(lop.rules.token("identifier", identifier), () => constant);
      var paragraphRule = identifierToConstant("p", documentMatchers.paragraph);
      var runRule = identifierToConstant("r", documentMatchers.run);
      var elementTypeRule = lop.rules.firstOf(
        "p or r or table",
        paragraphRule,
        runRule
      );
      var styleIdRule = lop.rules.sequence(
        lop.rules.tokenOfType("dot"),
        lop.rules.sequence.cut(),
        lop.rules.sequence.capture(identifierRule)
      ).map((styleId) => ({ styleId }));
      var styleNameMatcherRule = lop.rules.firstOf(
        "style name matcher",
        lop.rules.then(
          lop.rules.sequence(
            lop.rules.tokenOfType("equals"),
            lop.rules.sequence.cut(),
            lop.rules.sequence.capture(stringRule)
          ).head(),
          (styleName) => ({ styleName: documentMatchers.equalTo(styleName) })
        ),
        lop.rules.then(
          lop.rules.sequence(
            lop.rules.tokenOfType("startsWith"),
            lop.rules.sequence.cut(),
            lop.rules.sequence.capture(stringRule)
          ).head(),
          (styleName) => ({ styleName: documentMatchers.startsWith(styleName) })
        )
      );
      var styleNameRule = lop.rules.sequence(
        lop.rules.tokenOfType("open-square-bracket"),
        lop.rules.sequence.cut(),
        lop.rules.token("identifier", "style-name"),
        lop.rules.sequence.capture(styleNameMatcherRule),
        lop.rules.tokenOfType("close-square-bracket")
      ).head();
      var listTypeRule = lop.rules.firstOf(
        "list type",
        identifierToConstant("ordered-list", { isOrdered: true }),
        identifierToConstant("unordered-list", { isOrdered: false })
      );
      var listRule = sequence(
        lop.rules.tokenOfType("colon"),
        sequence.capture(listTypeRule),
        sequence.cut(),
        lop.rules.tokenOfType("open-paren"),
        sequence.capture(integerRule),
        lop.rules.tokenOfType("close-paren")
      ).map((listType, levelNumber) => ({
        list: {
          isOrdered: listType.isOrdered,
          levelIndex: levelNumber - 1
        }
      }));
      function createMatcherSuffixesRule(rules) {
        var matcherSuffix = lop.rules.firstOf.apply(
          lop.rules.firstOf,
          ["matcher suffix"].concat(rules)
        );
        var matcherSuffixes = lop.rules.zeroOrMore(matcherSuffix);
        return lop.rules.then(matcherSuffixes, (suffixes) => {
          var matcherOptions = {};
          suffixes.forEach((suffix) => {
            Object.assign(matcherOptions, suffix);
          });
          return matcherOptions;
        });
      }
      var paragraphOrRun = sequence(
        sequence.capture(elementTypeRule),
        sequence.capture(
          createMatcherSuffixesRule([styleIdRule, styleNameRule, listRule])
        )
      ).map((createMatcher, matcherOptions) => createMatcher(matcherOptions));
      var table = sequence(
        lop.rules.token("identifier", "table"),
        sequence.capture(createMatcherSuffixesRule([styleIdRule, styleNameRule]))
      ).map((options) => documentMatchers.table(options));
      var bold = identifierToConstant("b", documentMatchers.bold);
      var italic = identifierToConstant("i", documentMatchers.italic);
      var underline = identifierToConstant("u", documentMatchers.underline);
      var strikethrough = identifierToConstant(
        "strike",
        documentMatchers.strikethrough
      );
      var allCaps = identifierToConstant("all-caps", documentMatchers.allCaps);
      var smallCaps = identifierToConstant(
        "small-caps",
        documentMatchers.smallCaps
      );
      var highlight = sequence(
        lop.rules.token("identifier", "highlight"),
        lop.rules.sequence.capture(
          lop.rules.optional(
            lop.rules.sequence(
              lop.rules.tokenOfType("open-square-bracket"),
              lop.rules.sequence.cut(),
              lop.rules.token("identifier", "color"),
              lop.rules.tokenOfType("equals"),
              lop.rules.sequence.capture(stringRule),
              lop.rules.tokenOfType("close-square-bracket")
            ).head()
          )
        )
      ).map(
        (color) => documentMatchers.highlight({
          color: color.valueOrElse(void 0)
        })
      );
      var commentReference = identifierToConstant(
        "comment-reference",
        documentMatchers.commentReference
      );
      var commentRangeStart = identifierToConstant(
        "comment-range-start",
        documentMatchers.commentRangeStart
      );
      var commentRangeEnd = identifierToConstant(
        "comment-range-end",
        documentMatchers.commentRangeEnd
      );
      var inserted = identifierToConstant("ins", documentMatchers.inserted);
      var deleted = identifierToConstant("del", documentMatchers.deleted);
      var breakMatcher = sequence(
        lop.rules.token("identifier", "br"),
        sequence.cut(),
        lop.rules.tokenOfType("open-square-bracket"),
        lop.rules.token("identifier", "type"),
        lop.rules.tokenOfType("equals"),
        sequence.capture(stringRule),
        lop.rules.tokenOfType("close-square-bracket")
      ).map((breakType) => {
        switch (breakType) {
          case "line":
            return documentMatchers.lineBreak;
          case "page":
            return documentMatchers.pageBreak;
          case "column":
            return documentMatchers.columnBreak;
          default:
            throw new Error("Unknown break type: " + breakType);
        }
      });
      return lop.rules.firstOf(
        "element type",
        paragraphOrRun,
        table,
        bold,
        italic,
        underline,
        strikethrough,
        allCaps,
        smallCaps,
        highlight,
        commentReference,
        commentRangeStart,
        commentRangeEnd,
        inserted,
        deleted,
        breakMatcher
      );
    }
    function readHtmlPath(string) {
      return parseString(htmlPathRule(), string);
    }
    function htmlPathRule() {
      var capture = lop.rules.sequence.capture;
      var whitespaceRule = lop.rules.tokenOfType("whitespace");
      var freshRule = lop.rules.then(
        lop.rules.optional(
          lop.rules.sequence(
            lop.rules.tokenOfType("colon"),
            lop.rules.token("identifier", "fresh")
          )
        ),
        (option) => option.map(() => true).valueOrElse(false)
      );
      var separatorRule = lop.rules.then(
        lop.rules.optional(
          lop.rules.sequence(
            lop.rules.tokenOfType("colon"),
            lop.rules.token("identifier", "separator"),
            lop.rules.tokenOfType("open-paren"),
            capture(stringRule),
            lop.rules.tokenOfType("close-paren")
          ).head()
        ),
        (option) => option.valueOrElse("")
      );
      var tagNamesRule = lop.rules.oneOrMoreWithSeparator(
        identifierRule,
        lop.rules.tokenOfType("choice")
      );
      var styleElementRule = lop.rules.sequence(
        capture(tagNamesRule),
        capture(lop.rules.zeroOrMore(attributeOrClassRule)),
        capture(freshRule),
        capture(separatorRule)
      ).map((tagName, attributesList, fresh, separator) => {
        var attributes = {};
        var options = {};
        attributesList.forEach((attribute) => {
          if (attribute.append && attributes[attribute.name]) {
            attributes[attribute.name] += " " + attribute.value;
          } else {
            attributes[attribute.name] = attribute.value;
          }
        });
        if (fresh) {
          options.fresh = true;
        }
        if (separator) {
          options.separator = separator;
        }
        return htmlPaths.element(tagName, attributes, options);
      });
      return lop.rules.firstOf(
        "html path",
        lop.rules.then(lop.rules.tokenOfType("bang"), () => htmlPaths.ignore),
        lop.rules.then(
          lop.rules.zeroOrMoreWithSeparator(
            styleElementRule,
            lop.rules.sequence(
              whitespaceRule,
              lop.rules.tokenOfType("gt"),
              whitespaceRule
            )
          ),
          htmlPaths.elements
        )
      );
    }
    var identifierRule = lop.rules.then(
      lop.rules.tokenOfType("identifier"),
      decodeEscapeSequences
    );
    var integerRule = lop.rules.tokenOfType("integer");
    var stringRule = lop.rules.then(
      lop.rules.tokenOfType("string"),
      decodeEscapeSequences
    );
    var escapeSequences = {
      n: "\n",
      r: "\r",
      t: "	"
    };
    function decodeEscapeSequences(value) {
      return value.replace(
        /\\(.)/g,
        (match, code) => escapeSequences[code] || code
      );
    }
    var attributeRule = lop.rules.sequence(
      lop.rules.tokenOfType("open-square-bracket"),
      lop.rules.sequence.cut(),
      lop.rules.sequence.capture(identifierRule),
      lop.rules.tokenOfType("equals"),
      lop.rules.sequence.capture(stringRule),
      lop.rules.tokenOfType("close-square-bracket")
    ).map((name, value) => ({ name, value, append: false }));
    var classRule = lop.rules.sequence(
      lop.rules.tokenOfType("dot"),
      lop.rules.sequence.cut(),
      lop.rules.sequence.capture(identifierRule)
    ).map((className) => ({ name: "class", value: className, append: true }));
    var attributeOrClassRule = lop.rules.firstOf(
      "attribute or class",
      attributeRule,
      classRule
    );
    function parseString(rule, string) {
      var tokens = tokenise(string);
      var parser = lop.Parser();
      var parseResult = parser.parseTokens(rule, tokens);
      if (parseResult.isSuccess()) {
        return results.success(parseResult.value());
      }
      return new results.Result(null, [
        results.warning(describeFailure(string, parseResult))
      ]);
    }
    function describeFailure(input, parseResult) {
      return "Did not understand this style mapping, so ignored it: " + input + "\n" + parseResult.errors().map(describeError).join("\n");
    }
    function describeError(error) {
      return "Error was at character number " + error.characterNumber() + ": Expected " + error.expected + " but got " + error.actual;
    }
    var styleRule = createStyleRule();
  }
});

// lib/options-reader.ts
var require_options_reader = __commonJS({
  "lib/options-reader.ts"(exports) {
    "use strict";
    exports.readOptions = readOptions;
    var defaultStyleMap = exports._defaultStyleMap = [
      "p.Heading1 => h1:fresh",
      "p.Heading2 => h2:fresh",
      "p.Heading3 => h3:fresh",
      "p.Heading4 => h4:fresh",
      "p.Heading5 => h5:fresh",
      "p.Heading6 => h6:fresh",
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
      "p[style-name='Heading 4'] => h4:fresh",
      "p[style-name='Heading 5'] => h5:fresh",
      "p[style-name='Heading 6'] => h6:fresh",
      "p[style-name='heading 1'] => h1:fresh",
      "p[style-name='heading 2'] => h2:fresh",
      "p[style-name='heading 3'] => h3:fresh",
      "p[style-name='heading 4'] => h4:fresh",
      "p[style-name='heading 5'] => h5:fresh",
      "p[style-name='heading 6'] => h6:fresh",
      // Apple Pages
      "p.Heading => h1:fresh",
      "p[style-name='Heading'] => h1:fresh",
      "r[style-name='Strong'] => strong",
      "p[style-name='footnote text'] => p:fresh",
      "r[style-name='footnote reference'] =>",
      "p[style-name='endnote text'] => p:fresh",
      "r[style-name='endnote reference'] =>",
      "p[style-name='annotation text'] => p:fresh",
      "r[style-name='annotation reference'] =>",
      // LibreOffice
      "p[style-name='Footnote'] => p:fresh",
      "r[style-name='Footnote anchor'] =>",
      "p[style-name='Endnote'] => p:fresh",
      "r[style-name='Endnote anchor'] =>",
      "p:unordered-list(1) => ul > li:fresh",
      "p:unordered-list(2) => ul|ol > li > ul > li:fresh",
      "p:unordered-list(3) => ul|ol > li > ul|ol > li > ul > li:fresh",
      "p:unordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh",
      "p:unordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh",
      "p:ordered-list(1) => ol > li:fresh",
      "p:ordered-list(2) => ul|ol > li > ol > li:fresh",
      "p:ordered-list(3) => ul|ol > li > ul|ol > li > ol > li:fresh",
      "p:ordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh",
      "p:ordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh",
      "r[style-name='Hyperlink'] =>",
      "p[style-name='Normal'] => p:fresh",
      // Apple Pages
      "p.Body => p:fresh",
      "p[style-name='Body'] => p:fresh"
    ];
    var standardOptions = exports._standardOptions = {
      externalFileAccess: false,
      transformDocument: identity,
      includeDefaultStyleMap: true,
      includeEmbeddedStyleMap: true
    };
    function readOptions(options) {
      options = options || {};
      return Object.assign({}, standardOptions, options, {
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
        }
      });
    }
    function readStyleMap(styleMap) {
      if (!styleMap) {
        return [];
      }
      if (typeof styleMap === "string") {
        return styleMap.split("\n").map((line) => line.trim()).filter((line) => line !== "" && line.charAt(0) !== "#");
      }
      return styleMap;
    }
    function identity(value) {
      return value;
    }
  }
});

// browser/unzip.js
var require_unzip = __commonJS({
  "browser/unzip.js"(exports) {
    "use strict";
    var promises = require_promises();
    var zipfile = require_zipfile();
    exports.openZip = openZip;
    function openZip(options) {
      if (options.arrayBuffer) {
        return promises.resolve(zipfile.openArrayBuffer(options.arrayBuffer));
      }
      return promises.reject(new Error("Could not find file in options"));
    }
  }
});

// lib/underline.ts
var require_underline = __commonJS({
  "lib/underline.ts"(exports) {
    "use strict";
    var htmlPaths = require_html_paths();
    var Html = require_html();
    exports.element = element;
    function element(name) {
      return (html) => Html.elementWithTag(htmlPaths.element(name), [html]);
    }
  }
});

// lib/index.ts
var require_lib = __commonJS({
  "lib/index.ts"(exports) {
    var docxReader = require_docx_reader();
    var docxStyleMap = require_style_map();
    var DocumentConverter = require_document_to_html().DocumentConverter;
    var convertElementToRawText = require_raw_text().convertElementToRawText;
    var readStyle = require_style_reader().readStyle;
    var readOptions = require_options_reader().readOptions;
    var unzip = require_unzip();
    var Result = require_results().Result;
    exports.convertToHtml = convertToHtml;
    exports.convertToMarkdown = convertToMarkdown;
    exports.convert = convert;
    exports.extractRawText = extractRawText;
    exports.images = require_images();
    exports.transforms = require_transforms();
    exports.underline = require_underline();
    exports.embedStyleMap = embedStyleMap;
    exports.readEmbeddedStyleMap = readEmbeddedStyleMap;
    function convertToHtml(input, options) {
      return withDone(convert(input, options));
    }
    function convertToMarkdown(input, options) {
      var markdownOptions = Object.create(options || {});
      markdownOptions.outputFormat = "markdown";
      return withDone(convert(input, markdownOptions));
    }
    function convert(input, options) {
      options = readOptions(options);
      return withDone(
        unzip.openZip(input).then(
          (docxFile) => docxStyleMap.readStyleMap(docxFile).then((styleMap) => {
            options.embeddedStyleMap = styleMap;
            return docxFile;
          })
        ).then(
          (docxFile) => docxReader.read(docxFile, input, options).then((documentResult) => documentResult.map(options.transformDocument)).then(
            (documentResult) => convertDocumentToHtml(documentResult, options)
          )
        )
      );
    }
    function readEmbeddedStyleMap(input) {
      return withDone(unzip.openZip(input).then(docxStyleMap.readStyleMap));
    }
    function convertDocumentToHtml(documentResult, options) {
      var styleMapResult = parseStyleMap(options.readStyleMap());
      var parsedOptions = Object.assign({}, options, {
        styleMap: styleMapResult.value
      });
      var documentConverter = new DocumentConverter(parsedOptions);
      return documentResult.flatMapThen(
        (document) => styleMapResult.flatMapThen(
          (styleMap) => documentConverter.convertToHtml(document)
        )
      );
    }
    function parseStyleMap(styleMap) {
      return Result.combine((styleMap || []).map(readStyle)).map(
        (styleMap2) => styleMap2.filter((styleMapping) => !!styleMapping)
      );
    }
    function extractRawText(input) {
      return withDone(
        unzip.openZip(input).then(docxReader.read).then((documentResult) => documentResult.map(convertElementToRawText))
      );
    }
    function embedStyleMap(input, styleMap) {
      return withDone(
        unzip.openZip(input).then(
          (docxFile) => Promise.resolve(docxStyleMap.writeStyleMap(docxFile, styleMap)).then(
            () => docxFile
          )
        ).then((docxFile) => docxFile.toArrayBuffer()).then((arrayBuffer) => ({
          toArrayBuffer() {
            return arrayBuffer;
          },
          toBuffer() {
            return Buffer.from(arrayBuffer);
          }
        }))
      );
    }
    exports.styleMapping = () => {
      throw new Error(
        `Use a raw string instead of mammoth.styleMapping e.g. "p[style-name='Title'] => h1" instead of mammoth.styleMapping("p[style-name='Title'] => h1")`
      );
    };
    function withDone(promise) {
      if (!promise || typeof promise.done === "function") {
        return promise;
      }
      Object.defineProperty(promise, "done", {
        configurable: true,
        enumerable: false,
        value: function(onFulfilled, onRejected) {
          promise.then(onFulfilled, onRejected).catch(function(error) {
            setTimeout(function() {
              throw error;
            }, 0);
          });
        },
        writable: true
      });
      return promise;
    }
  }
});
export default require_lib();
