import { TextTriple } from "../sections/content/types/content";

const checkIfTripleIsValid = (triple: TextTriple) => {
  const { subject, predicate, object } = triple;
  if (!subject || !object || !predicate) {
    return false;
  }
  return true;
};

const filterInvalidTriples = (triples: TextTriple[]) =>
  triples.filter((triple) => checkIfTripleIsValid(triple));

const fillMissingPredicateUrl = (triples: TextTriple[]) =>
  triples.map((triple) => {
    return triple;
  });

const filterDuplicateTriples = (triples: TextTriple[]) => {
  const uniqueTriples = new Set(
    triples.map((triple) => JSON.stringify(triple))
  );
  return Array.from(uniqueTriples).map((triple) => JSON.parse(triple));
};

// const filterDuplicateSubjectTriples = (triples: TextTriple[]): TextTriple[] => {
//   const uniqueSubjects = new Set(triples.map((triple) => triple.subject.text));
//   return Array.from(uniqueSubjects).map((subject) => {
//     const triplesWithSubject = triples.filter(
//       (triple) => triple.subject.text === subject
//     );
//     if (triplesWithSubject.length === 1) {
//       return triplesWithSubject[0];
//     }
//     const uniquePredicates = new Set(
//       triplesWithSubject.map((triple) => triple.predicate)
//     );
//     return {
//       subject,
//       predicate: Array.from(uniquePredicates).join(", "),
//       object: triplesWithSubject.map((triple) => triple.object.text).join(", "),
//     };
//   });
// };

// if a certain triple is not valid, it will be removed
// if no triples are valid, the content will be empty
export const correctGeneratedTriples = (triples: TextTriple[]) => {
  let correctedTriples = triples;
  correctedTriples = filterInvalidTriples(correctedTriples);
  correctedTriples = filterDuplicateTriples(correctedTriples);
  // correctedTriples = filterDuplicateSubjectTriples(correctedTriples);
  if (correctedTriples.length === 0) {
    return [];
  }
  return fillMissingPredicateUrl(correctedTriples);
};
