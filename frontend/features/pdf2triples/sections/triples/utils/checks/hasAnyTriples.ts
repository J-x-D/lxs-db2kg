import { RDFResource } from "features/pdf2triples/types/triple";

/**
 * Checks if the content has any triples.
 * @param rdfResources The triples to check.
 * @returns True if the content has any triples, false otherwise.
 * @category PDF 2 Triples
 */
export const checkHasAnyTriples = (rdfResources: RDFResource[]): boolean => {
  return rdfResources?.length > 0;
};
