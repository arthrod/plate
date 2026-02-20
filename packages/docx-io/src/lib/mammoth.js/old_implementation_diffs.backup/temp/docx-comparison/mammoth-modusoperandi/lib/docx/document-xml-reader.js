exports.DocumentXmlReader = DocumentXmlReader;

var documents = require('../documents');
var Result = require('../results').Result;
var nodes = require('../xml/nodes');
// [FS] 16-01-2023
// Chapter Header Images inside Table
var Element = nodes.Element;

const pAttrs = {
  'w:rsidR': '00E6731F',
  'w:rsidRDefault': '00E6731F',
};
const tcW11Attrs = {
  'w:w': '9420',
  'w:type': 'dxa',
};

const tcW21Attrs = {
  'w:w': '2263',
  'w:type': 'dxa',
};

const tcW22Attrs = {
  'w:w': '7157',
  'w:type': 'dxa',
};
const tr1Attrs = {
  'w:rsidR': '00E6731F',
  'w:rsidTr': '00864C01',
};

const tr2Attrs = {
  'w:rsidR': '00E6731F',
  'w:rsidTr': '00E6731F',
};
const trH1json = {
  type: 'element',
  name: 'w:trHeight',
  attributes: {
    'w:val': '1377',
  },
  children: [],
};
const trH2json = {
  type: 'element',
  name: 'w:trHeight',
  attributes: {
    'w:val': '1300',
  },
  children: [],
};
const gridSpanAttrs = { 'w:val': '2' };

const gridCol1Attrs = { 'w:w': '2263' };
const gridCol2Attrs = { 'w:w': '7157' };

const tblLookAttrs = {
  'w:val': '04A0',
  'w:firstRow': '1',
  'w:lastRow': '0',
  'w:firstColumn': '1',
  'w:lastColumn': '0',
  'w:noHBand': '0',
  'w:noVBand': '1',
};
const tblStyleAttrs = { 'w:val': 'TableGrid', isCusTbl: true };

var tcW21 = new Element('w:tcW', tcW21Attrs, []);
var tcW22 = new Element('w:tcW', tcW22Attrs, []);
var tcPr21 = new Element('w:tcPr', { isLogoImg: true }, [tcW21]);
var tcPr22 = new Element('w:tcPr', {}, [tcW22]);

var trPr2 = new Element('w:trPr', {}, [trH2json]);

var tcW11 = new Element('w:tcW', tcW11Attrs, []);
var gridSpan = new Element('w:gridSpan', gridSpanAttrs, []);
var tcPr11 = new Element('w:tcPr', { isLogoImg: true }, [tcW11, gridSpan]);

var trPr1 = new Element('w:trPr', {}, [trH1json]);

var gridCol1 = new Element('w:gridSpan', gridCol1Attrs, []);
var gridCol2 = new Element('w:gridSpan', gridCol2Attrs, []);

var tblGrid = new Element('w:tblGrid', {}, [gridCol1, gridCol2]); // 2nd Child

var tblLook = new Element('w:tblLook', tblLookAttrs, []);
var tblW = new Element('w:tblW', tcW11Attrs, []);
var tblStyle = new Element('w:tblStyle', tblStyleAttrs, []);

var tblPr = new Element('w:tblPr', {}, [tblStyle, tblW, tblLook]); // 1st Child

function DocumentXmlReader(options) {
  var bodyReader = options.bodyReader;

  function convertXmlToDocument(element) {
    // [FS] 16-01-2023
    // Chapter Header Images inside Table
    var bodies = element.first('w:body');
    var body = checkGroupStyleName(bodies);
    if (body == null) {
      throw new Error(
        'Could not find the body element: are you sure this is a docx file?'
      );
    }

    var result = bodyReader
      .readXmlElements(body.children)
      .map(function (children) {
        return new documents.Document(children, {
          notes: options.notes,
          comments: options.comments,
        });
      });
    return new Result(result.value, result.messages);
  }

  return {
    convertXmlToDocument: convertXmlToDocument,
  };
}

// [FS] 11-03-2023
// Check if the element has Border
/**
       *
       * @param element: element
       
       */
function readBottomBorderAttributes(element) {
  var pBdrElement = element.first('w:pBdr');
  if (pBdrElement) {
    for (var i = 0; i < pBdrElement.children.length; i++) {
      if (pBdrElement.children[i].name === 'w:bottom') {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

// [FS] 11-03-2023
// To check whether the text matches
/**
 *
 * @param element: element
 * @param i: index of paragraph element
 */
function customTextCheck(element, i) {
  if (element.children[i] && element.children[i].name === 'w:p') {
    for (var j = 0; j < element.children[i].children.length; j++) {
      if (element.children[i].children[j].name === 'w:r') {
        for (
          var k = 0;
          k < element.children[i].children[j].children.length;
          k++
        ) {
          if (element.children[i].children[j].children[k].name === 'w:t') {
            for (
              var l = 0;
              l < element.children[i].children[j].children[k].children.length;
              l++
            ) {
              var textVal =
                element.children[i].children[j].children[k].children[l].value;
              //      if (textVal.includes() === "Last Updated: " || textVal === "Last Reviewed: "|| textVal==="Last" ||textVal==="Last ") {
              if (
                textVal.includes('Last Updated: ') ||
                textVal.includes('Last Reviewed: ')
              ) {
                return true;
              }
            }
          }
        }
      }
    }
  }
}

// [FS] 11-03-2023
// To apply Custom StyleName
/**
       *
       * @param ele: element for which style is to be applied 
       
       */
function applyCustomStyleName(ele) {
  var pStyleElement = ele.first('w:pStyle');
  if (pStyleElement == undefined) {
    var newChildren = new Element('w:pStyle', {}, []);
    ele.children.unshift(newChildren);
    pStyleElement = ele.first('w:pStyle');
  }
  pStyleElement.attributes['w:val'] = 'Chapter Header';
}

// [FS] 20-01-2023
// To check whether the Group's StyleName is LC-ChapHeadLogo
/**
 *
 * @param element: element
 */

function checkGroupStyleName(element) {
  for (var i = 0; i < element.children.length; i++) {
    if (element.children[i] && element.children[i].name === 'w:p') {
      for (var j = 0; j < element.children[i].children.length; j++) {
        if (element.children[i].children[j].name === 'w:pPr') {
          var isBdr = readBottomBorderAttributes(
            element.children[i].children[j]
          );
          var isTextMatching = false;
          var indexOfElement = i + 1;
          if (isBdr) {
            isTextMatching = customTextCheck(element, indexOfElement);
            if (isTextMatching == undefined) {
              indexOfElement = i + 2;
              isTextMatching = customTextCheck(element, indexOfElement);
            }
          }
          if (isBdr && isTextMatching) {
            var pPrElement = element.children[i].children[j];
            applyCustomStyleName(pPrElement);
          }
          for (
            var k = 0;
            k < element.children[i].children[j].children.length;
            k++
          ) {
            if (
              element.children[i].children[j].children[k].name === 'w:pStyle'
            ) {
              if (
                element.children[i].children[j].children[k].attributes[
                  'w:val'
                ] === 'LC-ChapHeadLogo'
              ) {
                var pPr = element.children[i].children[j];
                replaceParawithTable(element, i, pPr);
              }
            }
          }
        }
      }
    }
  }
  return element;
}
// [FS] 20-01-2023
// To filter the Image Info from Group
/**
 *
 * @param Info: Group/picture Informations
 * @param elName:  Element name
 * @param ChildEleName:Child Element Name
 */

function filterInfo(Info, elName, ChildEleName) {
  var Info = Info.children.filter(function (el) {
    for (var i = 0; i < el.children.length; i++) {
      if (el.children[i].name === elName) {
        if (elName == 'v:textbox') {
          if (
            el.children[i].first('w:txbxContent') &&
            el.children[i].first('w:txbxContent').first('w:p')
          ) {
            if (
              el.children[i]
                .first('w:txbxContent')
                .first('w:p')
                .first('w:pPr') &&
              el.children[i]
                .first('w:txbxContent')
                .first('w:p')
                .first('w:pPr')
                .first('w:jc')
            ) {
              var alignElement = el.children[i]
                .first('w:txbxContent')
                .first('w:p')
                .first('w:pPr')
                .first('w:jc');
              if (alignElement) {
                alignElement.attributes['w:val'] = 'center';
              }
            }
          }

          return el.children[i];
        } else {
          return el.name === ChildEleName;
        }
      }
    }
  });
  return Info;
}

// [FS] 20-01-2023
// To replace Paragraph with Table  for Chapter Header Images
/**
 *
 * @param element: Paragraph element to be replaced
 * @param i:  index
 * @param pPr:Paragraph Properties
 */
function replaceParawithTable(element, i, pPr) {
  if (
    undefined !== element.children[i] &&
    undefined !== element.children[i].children
  ) {
    for (var l = 0; l < element.children[i].children.length; l++) {
      if (element.children[i].children[l].name === 'w:r') {
        if (
          undefined !== element.children[i] &&
          undefined !== element.children[i].children[l] &&
          undefined !== element.children[i].children[l].children
        ) {
          for (
            var m = 0;
            m < element.children[i].children[l].children.length;
            m++
          ) {
            if (
              element.children[i].children[l].children[m] &&
              element.children[i].children[l].children[m].name === 'w:pict'
            ) {
              var GroupInfo = null;
              if (undefined !== element.children[i].children[l].children[m]) {
                GroupInfo =
                  element.children[i].children[l].children[m].first('v:group');
              }
              if (GroupInfo) {
                var txtElName = 'v:textbox';
                var ImgElName = 'v:imagedata';
                var shapeElName = 'v:shape';
                var ImageInfo = filterInfo(GroupInfo, ImgElName, shapeElName);
                ImageInfo[0].first('v:imagedata')['id'] = 'LC-Image-1';
                ImageInfo[1].first('v:imagedata')['id'] = 'LC-Image-2';
                var r11 = new Element('w:r', {}, [ImageInfo[0]]);
                var r21 = new Element('w:r', {}, [ImageInfo[1]]);
                var textBoxInfo = filterInfo(GroupInfo, txtElName, shapeElName);
                if (textBoxInfo.length == 0) {
                  var pictInfo = element.children[i]
                    .first('w:r')
                    .first('w:pict');

                  textBoxInfo = filterInfo(pictInfo, txtElName);
                }
                textBoxInfo[0].first(txtElName)['id'] = 'LC-Center';
                var pC11 = new Element('w:p', pAttrs, [pPr, r11]);
                var pC21 = new Element('w:p', pAttrs, [pPr, r21]);
                var r22 = new Element('w:r', {}, [textBoxInfo[0]]);
                var pC22 = new Element('w:p', pAttrs, [pPr, r22]);

                var tc11 = new Element('w:tc', {}, [tcPr11, pC11]);

                var tc21 = new Element('w:tc', {}, [tcPr21, pC21]);
                var tc22 = new Element('w:tc', {}, [tcPr22, pC22]);

                var tr1 = new Element('w:tr', tr2Attrs, [trPr1, tc11]); // 3rd Child
                var tr2 = new Element('w:tr', tr2Attrs, [trPr2, tc21, tc22]); // 4th child

                var tblChildren = [tblPr, tblGrid, tr1, tr2];

                element.children[i].name = 'w:tbl';
                element.children[i].children = tblChildren;
                element.children[i].attributes = { isCusTbl: true };

                //[FS] 17-07-2024
                // AFDP 2-0 - GIISR 29 Jan 2015 Document not importing successfully
                
                if(l > element.children[i].children.length){
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
}
