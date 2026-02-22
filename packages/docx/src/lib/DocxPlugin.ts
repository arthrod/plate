import {
  type HtmlDeserializer,
  type SlatePlugin,
  createSlatePlugin,
  KEYS,
} from 'platejs';

import { cleanDocx } from './docx-cleaner/cleanDocx';
import {
  getDocxIndent,
  getDocxTextIndent,
} from './docx-cleaner/utils/getDocxIndent';
import { getDocxListContentHtml } from './docx-cleaner/utils/getDocxListContentHtml';
import { getDocxListIndent } from './docx-cleaner/utils/getDocxListIndent';
import { getTextListStyleType } from './docx-cleaner/utils/getTextListStyleType';
import { isDocxContent } from './docx-cleaner/utils/isDocxContent';
import { isDocxList } from './docx-cleaner/utils/isDocxList';

const ZERO_LENGTH_REGEX = /^0(?:\.0+)?(?:px|pt|pc|cm|mm|in|em|rem|%)?$/i;
const ZERO_BORDER_REGEX =
  /^0(?:\.0+)?(?:px|pt|pc|cm|mm|in|em|rem|%)?(?:\s+none)?$/;

const hasNonZeroLength = (value: string) =>
  !ZERO_LENGTH_REGEX.test(value.trim());

const hasMeaningfulBorder = (value: string) => {
  const normalized = value.trim().toLowerCase();

  if (!normalized || normalized === 'none') return false;
  if (ZERO_BORDER_REGEX.test(normalized)) {
    return false;
  }

  return true;
};

const getParagraphStyleAttributes = (element: Element) => {
  const style = (element as HTMLElement).style;
  const paragraphStyles: Record<string, string> = {};

  if (style.marginTop && hasNonZeroLength(style.marginTop)) {
    paragraphStyles.marginTop = style.marginTop;
  }
  if (style.marginBottom && hasNonZeroLength(style.marginBottom)) {
    paragraphStyles.marginBottom = style.marginBottom;
  }
  if (style.marginLeft && hasNonZeroLength(style.marginLeft)) {
    paragraphStyles.marginLeft = style.marginLeft;
  }
  if (style.marginRight && hasNonZeroLength(style.marginRight)) {
    paragraphStyles.marginRight = style.marginRight;
  }
  if (style.textIndent && hasNonZeroLength(style.textIndent)) {
    paragraphStyles.textIndent = style.textIndent;
  }
  if (style.borderTop && hasMeaningfulBorder(style.borderTop)) {
    paragraphStyles.borderTop = style.borderTop;
  }
  if (style.borderRight && hasMeaningfulBorder(style.borderRight)) {
    paragraphStyles.borderRight = style.borderRight;
  }
  if (style.borderBottom && hasMeaningfulBorder(style.borderBottom)) {
    paragraphStyles.borderBottom = style.borderBottom;
  }
  if (style.borderLeft && hasMeaningfulBorder(style.borderLeft)) {
    paragraphStyles.borderLeft = style.borderLeft;
  }

  return paragraphStyles;
};

const parse: HtmlDeserializer['parse'] = ({ element, type }) => {
  const node: any = { type };
  const paragraphStyles = getParagraphStyleAttributes(element);

  if (isDocxList(element)) {
    node.indent = getDocxListIndent(element);

    const text = element.textContent ?? '';

    node.listStyleType = getTextListStyleType(text) ?? 'disc';

    element.innerHTML = getDocxListContentHtml(element);
  } else {
    const indent = getDocxIndent(element);

    if (indent) {
      node.indent = indent;
    }

    const textIndent = getDocxTextIndent(element);

    if (textIndent) {
      node.textIndent = textIndent;
    }
  }

  if (Object.keys(paragraphStyles).length > 0) {
    node.attributes = {
      ...(node.attributes || {}),
      style: {
        ...(node.attributes?.style || {}),
        ...paragraphStyles,
      },
    };
  }

  return node;
};

export const DocxPlugin = createSlatePlugin({
  key: KEYS.docx,
  editOnly: true,
  inject: {
    plugins: {
      [KEYS.html]: {
        parser: {
          transformData: ({ data, dataTransfer }) => {
            const rtf = dataTransfer.getData('text/rtf');

            return cleanDocx(data, rtf);
          },
        },
      },
    },
  },
  override: {
    plugins: {
      ...Object.fromEntries(
        ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((key) => [
          key,
          {
            parsers: {
              html: {
                deserializer: {
                  parse,
                },
              },
            },
          } satisfies Partial<SlatePlugin>,
        ])
      ),
      img: {
        parser: {
          query: ({ dataTransfer }) => {
            const data = dataTransfer.getData('text/html');
            const { body } = new DOMParser().parseFromString(data, 'text/html');

            return !isDocxContent(body);
          },
        },
      },
    },
  },
});
