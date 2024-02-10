import { KNOWN_KEYS, RDFProperty, RDFResource, RDFValue } from "features/pdf2triples/types/triple";

export function getValueBasedOnAccessKey(accessKey: "subject" | "predicate" | 'object', triple?: RDFResource): string {
    if (!triple) return '';

    if (accessKey === 'subject') {
        return triple?.['@id'] ?? '';
    }
    if (accessKey === 'predicate') {
        const keys = Object.keys(triple).filter((k) => !KNOWN_KEYS.includes(k));
        return keys[0] ?? keys[0] ?? '';
    }
    if (accessKey === 'object') {
        const key = Object.keys(triple).filter((k) => !KNOWN_KEYS.includes(k))[0] as keyof RDFResource;
        const rdfResource = (triple[key] as RDFValue[])?.[0];
        if (!rdfResource) return '';
        if (Object.keys(rdfResource).includes('@value')) {
            return rdfResource?.["@value"] ?? '';
        }
        return rdfResource?.["@id"] ?? '';
    }
    return '';
}

export function getLabelBasedOnAccessKey(id: string, triples: RDFResource[]): string {
    if (!id) return '';
    if (typeof id !== 'string') return String(id)
    const triple = triples.find((t) => t['@id'] === id);
    const label = (triple?.["http://www.w3.org/2000/01/rdf-schema#label"] as RDFProperty[])?.[0]?.["@value"] as string;
    if (!label) {
        if (id.includes('#')) return id.split('#').pop() ?? id;
        if (id.includes('/')) return id.split('/').pop() ?? id;
    }
    return label;
} 