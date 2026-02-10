import { type NodeEntry, type SlateEditor, KEYS } from 'platejs';

export const toggleListByPath = (
  editor: SlateEditor,
  [node, path]: NodeEntry,
  listStyleType: string
) => {
  editor.tf.withoutNormalizing(() => {
    if (listStyleType === 'todo') {
      editor.tf.setNodes(
        {
          [KEYS.indent]: node.indent ?? 1,
          [KEYS.listChecked]: false,
          [KEYS.listType]: listStyleType,
          type: KEYS.p,
        },
        {
          at: path,
        }
      );
    } else {
      editor.tf.unsetNodes([KEYS.listChecked], { at: path });
      editor.tf.setNodes(
        {
          [KEYS.indent]: node.indent ?? 1,
          [KEYS.listType]: listStyleType,
          type: KEYS.p,
        },
        {
          at: path,
        }
      );
    }
  });
};

export const toggleListByPathUnSet = (
  editor: SlateEditor,
  [, path]: NodeEntry
) =>
  editor.tf.unsetNodes([KEYS.listType, KEYS.indent, KEYS.listChecked], {
    at: path,
  });
