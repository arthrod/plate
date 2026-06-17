import {
  cleanHtmlBrElements,
  cleanHtmlEmptyElements,
  cleanHtmlFontElements,
  cleanHtmlLinkElements,
  cleanHtmlTextNodes,
  copyBlockMarksToSpanChild,
  postCleanHtml,
  preCleanHtml,
} from 'platejs';

import {
  preProtectRawHtml,
  protectTrackingTokens,
  restoreTrackingTokens,
} from './protectTrackingTokens';
import {
  cleanDocxBrComments,
  cleanDocxEmptyParagraphs,
  cleanDocxFootnotes,
  cleanDocxImageElements,
  cleanDocxListElements,
  cleanDocxQuotes,
  cleanDocxSpans,
  isDocxContent,
} from './utils/index';

export const cleanDocx = (html: string, rtf: string): string => {
  // Wrap any raw tokens that land between tags before DOMParser sees them
  // (variant A — see #347).
  const document = new DOMParser().parseFromString(
    preCleanHtml(preProtectRawHtml(html)),
    'text/html'
  );
  const { body } = document;

  if (!rtf && !isDocxContent(body)) {
    return html;
  }

  // Swap every tracking-token text into an opaque placeholder span so the
  // existing pipeline cannot mutate token bytes.
  protectTrackingTokens(body);

  cleanDocxFootnotes(body);
  cleanDocxImageElements(document, rtf, body);
  cleanHtmlEmptyElements(body);
  cleanDocxEmptyParagraphs(body);
  cleanDocxQuotes(body);
  cleanDocxSpans(body);
  cleanHtmlTextNodes(body);
  cleanDocxBrComments(body);
  cleanHtmlBrElements(body);
  cleanHtmlLinkElements(body);
  cleanHtmlFontElements(body);
  cleanDocxListElements(body);
  copyBlockMarksToSpanChild(body);

  // Restore placeholder spans back to raw token text nodes.
  restoreTrackingTokens(body);

  // Prevent deserializeHtml from collapsing whitespace
  const preformattedWrapper = document.createElement('div');
  preformattedWrapper.style.whiteSpace = 'pre-wrap';
  preformattedWrapper.innerHTML = body.innerHTML;

  return postCleanHtml(preformattedWrapper.outerHTML);
};
