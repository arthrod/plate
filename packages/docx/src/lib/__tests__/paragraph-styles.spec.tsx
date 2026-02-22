/** @jsx jsxt */

import { jsxt } from '@platejs/test-utils';

import { getDocxTestName, testDocxDeserializer } from './testDocxDeserializer';

jsxt;

const name = 'paragraph-styles';

describe(getDocxTestName(name), () => {
  testDocxDeserializer({
    expected: (
      <editor>
        <hp
          attributes={{
            style: {
              borderLeft: '1pt solid black',
              marginBottom: '6pt',
              marginLeft: '36pt',
              marginRight: '18pt',
              marginTop: '12pt',
              textIndent: '-12pt',
            },
          }}
          indent={1}
        >
          Styled paragraph
        </hp>
      </editor>
    ),
    filename: name,
    preserveAttributes: true,
  });
});
