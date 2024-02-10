import { RDFResource } from "features/pdf2triples/types/triple";

export function removeSelectedTripleText({
  selectedTriple,
  triples,
}: {
  selectedTriple: RDFResource | null;
  triples: RDFResource[];
}): {
  triples: RDFResource[];
  error: string | null;
} {
  if (selectedTriple === null) {
    return {
      error: "No Triples selected",
      triples,
    };
  }

  if (triples.length === 0) {
    return {
      error: "No triples found",
      triples: triples,
    };
  }

  const triplesRemovedTriple = triples.filter(
    (triple) => triple.id !== selectedTriple.id
  );

  return {
    error: null,
    triples: triplesRemovedTriple,
  };
}
