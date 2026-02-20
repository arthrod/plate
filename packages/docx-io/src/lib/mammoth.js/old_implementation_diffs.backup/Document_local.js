// lib/schema.ts:411
export function Document(
  children: DocumentElement[],
  options?: DocumentOptions
): DocumentNode {
  const opts = options || {};
  return {
    type: 'document',
    children,
    notes: opts.notes || new Notes([]),
    comments: opts.comments || [],
  };
}
