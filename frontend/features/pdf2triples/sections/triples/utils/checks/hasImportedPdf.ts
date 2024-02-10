import type { ExtractedTextResponse } from "../../../content/types/pdfResponse";

/**
 * Checks if the pdf has been imported.
 * @param pdf The pdf to check.
 * @returns True if the pdf has been imported, false otherwise.
 */
export const hasImportedPdf = (pdf: ExtractedTextResponse | null): boolean => {
  return !!(pdf?.title || pdf?.text);
};
