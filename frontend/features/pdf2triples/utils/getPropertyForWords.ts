import { PropertyFromOntology } from "types/PropertyFromOntology";
import fetchPropertyViaNeuralEngine from "./fetchProperty";

export default async function getPropertyForWords(value:string, ontologies: string[]): Promise<PropertyFromOntology> {
    const options = await fetchPropertyViaNeuralEngine(value, ontologies);
    return {
        property: options[0]?.predicate,
        score: options[0]?.score,
    } as PropertyFromOntology;
};
