/**
 * Gets the user selection in the DOM and returns an array of all words selected.
 * @param words  The words to search in.
 * @returns An array of all words in between. An empty array if either id is not found.
 */

export const userSelectionToWords = (fullText: string): string => {
  const selection = window?.getSelection();
  if (!selection) return '';
  if (selection.type !== 'Range') return '';

  const anchor = selection?.anchorOffset ?? 0;
  const focus = selection?.focusOffset ?? 0;

  const start = Math.min(anchor, focus);
  const end = Math.max(anchor, focus);

  const text = fullText.substring(start, end);
  return text;
};
