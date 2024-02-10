import { RDFResource } from "features/pdf2triples/types/triple";
import { getLabelBasedOnAccessKey, getValueBasedOnAccessKey } from "./getValueAndLabel";

export const getLabel = (accessKey: "subject" | "predicate" | "object", triple: RDFResource | undefined, triples: RDFResource[]) => {
    const id = getValueBasedOnAccessKey(accessKey, triple);
    const label = getLabelBasedOnAccessKey(id, triples);
    let resource = label ?? "No Label";

    if (!id) return resource;

    let splittedId = String(id);
    if (splittedId.includes('/')) splittedId = splittedId.split('/').pop() ?? splittedId;
    if (accessKey === "predicate" && !label) resource = splittedId;
    if (accessKey === "object" && !label) resource = splittedId;
    return resource;
};

export const getTripleClass = (accessKey: "subject" | "predicate" | "object", triples: RDFResource[], triple?: RDFResource): string => {
    let type = (triple?.["@type"] as string[])[0]
    if (accessKey !== "subject") {
        const id = getValueBasedOnAccessKey(accessKey, triple);
        const tripleToUpdate = triples.find(
            (resource) => resource["@id"] === id,
        ) as RDFResource;
        const newType = (tripleToUpdate?.["@type"] as string[])?.[0];
        if (newType) type = newType;
    }

    if (type.includes("#"))
        return type.split("#")?.pop() ?? "No Class";
    if (type.includes("/"))
        return type.split("/")?.pop() ?? "No Class";
    return type;
};