import { RDFResource } from "features/pdf2triples/types/triple";

interface AddTripleProps {
  subject: string;
  predicate: string | null;
  object: string;
  triples: RDFResource[];
}

export function handleAddTriple({
  subject,
  predicate,
  object,
  triples,
}: AddTripleProps) {
  if (!subject || !predicate || !object) {
    // throw new Error("One of the values is empty");
    return;
  }
  // const { triples, error } = addNewTripleText({
  //   subject: subject,
  //   predicate: predicate,
  //   object: object,
  //   previousContent: triples,
  // });
  // if (error) {
  //   console.error(error);
  //   return;
  // }
  // return cleanContentJson(contentJson);
  // TODO: handle adding triple text
}
