import { RDFResource } from "features/pdf2triples/types/triple";

export function getObjectClassBasedOnResource(triples: RDFResource[], identifier: string): string {
    const triple = triples.find((t) => t["@id"] === identifier);
    
    return "";
}