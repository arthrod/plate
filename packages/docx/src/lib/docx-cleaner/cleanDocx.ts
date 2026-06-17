import {
  cleanHtmlBrElements,
  cleanHtmlFontElements,
  cleanHtmlLinkElements,
  postCleanHtml,
  preCleanHtml,
} from 'platejs';

// Variant B (#348): use the token-aware shadow versions of the platejs-core
// cleaners that touch text content / element-emptiness / span children, so
// `[[DOCX_*_*]]` tokens survive normalization and unwrap.
import {
  cleanHtmlEmptyElements,
  cleanHtmlTextNodes,
  copyBlockMarksToSpanChild,
} from './tokenAwareCoreCleaners';
import { __TOKEN_AWARE_CLEANER__ } from './tracking-tokens';
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

/**
 * Variant B (#348) build guard: every cleaner whose internals interact with
 * text content MUST carry the `__TOKEN_AWARE_CLEANER__` marker. Adding a new
 * cleaner without the marker fails this assertion at typecheck time.
 *
 * Cleaners listed as token-blind by-design (operate on tag names only):
 *   `cleanDocxFootnotes`, `cleanDocxImageElements`, `cleanDocxQuotes`,
 *   `cleanHtmlBrElements`, `cleanHtmlLinkElements`, `cleanHtmlFontElements`,
 *   `cleanDocxListElements` — none read text content, so tokens are safe.
 */
type TokenAwareCleaner = { [__TOKEN_AWARE_CLEANER__]: true };
const TOKEN_AWARE_CLEANERS = [
  cleanDocxBrComments,
  cleanDocxEmptyParagraphs,
  cleanDocxSpans,
  cleanHtmlEmptyElements,
  cleanHtmlTextNodes,
  copyBlockMarksToSpanChild,
] satisfies TokenAwareCleaner[];
// Reference the array so tree-shaking does not silently drop the assertion.
void TOKEN_AWARE_CLEANERS.length;

export const cleanDocx = (html: string, rtf: string): string => {
  const document = new DOMParser().parseFromString(
    preCleanHtml(html),
    'text/html'
  );
  const { body } = document;

  if (!rtf && !isDocxContent(body)) {
    return html;
  }

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

  // Prevent deserializeHtml from collapsing whitespace
  const preformattedWrapper = document.createElement('div');
  preformattedWrapper.style.whiteSpace = 'pre-wrap';
  preformattedWrapper.innerHTML = body.innerHTML;

  return postCleanHtml(preformattedWrapper.outerHTML);
};
