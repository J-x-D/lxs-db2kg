import { RDFResource } from "features/pdf2triples/types/triple";

/**
 * Checks if any triple is selected
 * @param index The index of the selected triple.
 * @returns True if any triple is selected, false otherwise.
 */
export const hasSelectedTriple = (selectedTriple: RDFResource | null) => {
  return selectedTriple !== null;
};
