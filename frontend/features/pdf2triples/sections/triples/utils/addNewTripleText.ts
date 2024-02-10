// function splitStringByQuery(
//   mainString: string,
//   queryString: string,
// ): string[] | null {
//   const regex = new RegExp(`\\b${queryString}\\b`);
//   const index = mainString.search(regex);

import { RDFResource } from "features/pdf2triples/types/triple";

//   if (index === -1) {
//     return null;
//   }

//   const beforeQuery = mainString.substring(0, index);
//   const afterQuery = mainString.substring(index + queryString.length);

//   return [beforeQuery, queryString, afterQuery];
// }

interface AddNewTripleTextResult {
  triples: RDFResource[];
  error: Error | null;
}
export function addNewTripleText({
  subject,
  predicate,
  object,
  triples,
}: {
  subject: string;
  predicate: string;
  object: string;
  triples: RDFResource[];
}): AddNewTripleTextResult | void {
  if (triples.length === 0) {
    return {
      error: new Error("Content is empty"),
      triples,
    };
  }
  // TODO: handle adding triple text
}
