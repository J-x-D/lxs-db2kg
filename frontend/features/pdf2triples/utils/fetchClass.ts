import { ClassFromOntology } from "features/pdf2triples/types/class";
import axios from "axios";

export type GroupedOptions = {
  group: string;
  class: string;
  score: number;
  fullClass: string;
};

export async function fetchClassViaNeuralEngine(
  query: string,
  ontologies: string[],
): Promise<GroupedOptions[]> {
  // url has to be defined and query and ontologies have to be longer than 0
  if (query.length < 1 || ontologies.length < 1) return [];

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_classes`;
  const response = await axios.post(
    url,
    { query, ontologies },
    {
      timeout: 1000 * 60 * 1, // 1 minutes
    },
  );
  return response.data.map((classFromOntology: ClassFromOntology) => {
    return {
      group: "Neural Engine",
      class: classFromOntology.class,
      score: classFromOntology.score,
      fullClass: `${classFromOntology.ontology_url}#${classFromOntology.class}`
    };
  });
}

export async function fetchExternalClasses(
  query: string,
  prefixes: string[],
): Promise<GroupedOptions[]> {
  const joinedPrefixes = prefixes.join(",");
  const url = `https://service.tib.eu/ts4tib/api/select?q=${query}&ontology=${joinedPrefixes}&type=class`;
  const response = await axios.get(url);

  const externalClasses: GroupedOptions[] = response.data.response.docs.map(
    (doc: any) => {
      return {
        class: `${doc.ontology_prefix}:${doc.label}`,
        score: 0,
        group: "External Ontologies",
      };
    },
  );
  return externalClasses;
}
