import { RDFResource } from "features/pdf2triples/types/triple";

export type CheckTripleErrorType = "NO_PREDICATE" | "DUPLICATE_SUBJECT";

type HasError = {
  hasError: true;
  errorType: CheckTripleErrorType;
};

type NoError = {
  hasError: false;
};

export type CheckTripleErrorState = HasError | NoError;

export const hasTripleDuplicateSubject = (
  triple: RDFResource,
  triples: RDFResource[],
): boolean => {
  // TODO create a check for duplicate subject
  // Not sure if this is still needed
  return false;
};

export const checkHasTripleButNoPredicate = (triple:RDFResource): boolean => {
  // TODO: create a check for triple with no predicate

  return false;
};

export default function checkTripleErrorState(
  triples: RDFResource[],
  index: number,
): CheckTripleErrorState {
  const triple = triples[index];
  if (!triple) return { hasError: false };

  if (hasTripleDuplicateSubject(triple, triples))
    return {
      hasError: true,
      errorType: "DUPLICATE_SUBJECT",
    };

  if (checkHasTripleButNoPredicate(triple))
    return {
      hasError: true,
      errorType: "NO_PREDICATE",
    };

  return {
    hasError: false,
  };
}
