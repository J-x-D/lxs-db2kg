import { type RDFResource } from "features/pdf2triples/types/triple";
import { checkHasAnyTriples } from "../../../utils/checks/hasAnyTriples";

type Status = "hidden" | "loading" | "error" | "success";
export interface TriplesCheckStatus {
  status: Status;
  tooltipLabel?: string;
}

const checkDuplicateSubjects = (triples: RDFResource[]): boolean => {
  // const hasDuplicateSubjects = triples.some((triple) =>
  //   hasTripleDuplicateSubject(triple, triples),
  // );
  // TODO create a check for duplicate subject
  return false;
};

const checkHasTriplesButNoPredicates = (triples: RDFResource[]): boolean => {
  // const hasTriplesButNoPredicates = contentJson.some((node: ContentNode) =>
  //   checkHasTripleButNoPredicate(node),
  // );
  // const hasTriplesButNoPredicates = triples.some((triple) =>
  //   checkHasTripleButNoPredicate(triple),
  // );
  // TODO create a check for triple with no predicate
  return false;
};

export function checkTriplesStatus(triples: RDFResource[]): TriplesCheckStatus {
  if (!checkHasAnyTriples(triples)) return { status: "hidden" };

  if (checkDuplicateSubjects(triples))
    return {
      status: "error",
      tooltipLabel: "Has duplicated subjects",
    };

  if (checkHasTriplesButNoPredicates(triples))
    return {
      status: "error",
      tooltipLabel: "Has triples with no predicates",
    };

  return {
    status: "success",
    tooltipLabel: "All triples are valid",
  };
}
