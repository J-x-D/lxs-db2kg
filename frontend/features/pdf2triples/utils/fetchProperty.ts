import axios from "axios";
import { GroupedPredicateOptions } from "../sections/triples/components/editTriple/predicate/EditPredicateProperty";
import { PropertyFromOntology } from "types/PropertyFromOntology";

export default async function fetchPropertyViaNeuralEngine(query: string, ontologies: string[]): Promise<GroupedPredicateOptions[]> {
    if (query.length < 1 || ontologies.length < 1) return [];

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_properties`;
    const response = await axios.post(url, { query, ontologies });
    return (response.data).map((classFromOntology: PropertyFromOntology) => {
        return {
            group: "Neural Engine",
            predicate: classFromOntology.property,
            score: classFromOntology.score
        };
    });
}

export async function fetchExternalProperties(query: string, prefixes: string[]): Promise<GroupedPredicateOptions[]> {
    if (query.length < 1 || prefixes.length < 1) return [];

    const joinedPrefixes = prefixes.join(",");
    const url = `https://service.tib.eu/ts4tib/api/select?q=${query}&ontology=${joinedPrefixes}&type=property`;
    const response = await axios.get(url);

    const externalClasses: GroupedPredicateOptions[] = response.data.response.docs.map((doc: any) => {
        return {
            predicate: `${doc.ontology_prefix}:${doc.label}`,
            score: 0,
            group: "External Ontologies"
        };
    });
    return externalClasses;

    return [];
}