import { RDFResource, RDFValue } from "features/pdf2triples/types/triple";
import { createHash } from "crypto";

export default function getHashedComment(triple: RDFResource): string {
    const comment = (triple?.["http://www.w3.org/2000/01/rdf-schema#comment"] as RDFValue[])?.[0]?.["@value"];
    const hash = createHash("sha256").update(String(comment)).digest("hex");
    return hash;
}