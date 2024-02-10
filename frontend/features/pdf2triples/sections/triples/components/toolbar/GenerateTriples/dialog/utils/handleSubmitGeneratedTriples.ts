import { KNOWN_KEYS, RDFValue } from "./../../../../../../../types/triple";
import { ExtractedTextResponse } from "features/pdf2triples/sections/content/types/pdfResponse";
import { Status } from "../GenerateTriplesDialog";
import { handleGenerateTriples } from "../../handleGenerateTriples";
import { type Prefix } from "types/Prefixes";
import { RDFResource } from "features/pdf2triples/types/triple";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getLabel } from "features/pdf2triples/sections/triples/utils/getTripleLabelAndClass";

const camelCaseToPhrase = (str: string) => (str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`) ?? '').replace(/_/g, ' ')

// Function to handle the generation of triples
const generateTriples = async (prompt: string, pdf: ExtractedTextResponse | null) => {
  return await handleGenerateTriples(prompt);
};

// Function to get sentence for a given query
const getSentenceForQuery = async (query: string, pdfId: string | undefined) => {
  const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/get_sentence", {
    query,
    id: pdfId,
  });
  return res.data.sentence;
};

// Function to process a single triple
const processTriple = async (triple: RDFResource, pdfId: string | undefined) => {
  const label = triple["http://www.w3.org/2000/01/rdf-schema#label"] as RDFValue[];
  const predicates = Object.keys(triple).filter((key) => !KNOWN_KEYS.includes(key));

  const processObjects = async (predicate: string, objects: RDFResource[]) => {
    return await Promise.all(
      objects.map(async (object) => {
        if (!object["@id"] && !object["@value"]) return;
        const s = triple["@id"]?.split("/").pop() ?? triple["@value"] as string;
        const o = object["@id"]?.split("/").pop() ?? object["@value"] as string;
        const p = predicate.split("/").pop();

        const query = `${p} ${o}`;

        const sentence = await getSentenceForQuery(query, pdfId);

        return {
          id: uuidv4(),
          "@id": triple["@id"],
          "@type": triple["@type"],
          "http://www.w3.org/2000/01/rdf-schema#label": label,
          "http://www.w3.org/2000/01/rdf-schema#comment": [{ "@value": sentence }],
          [predicate]: [object],
        } as RDFResource;
      })
    );
  };

  if (predicates.length > 1) {
    return await Promise.all(
      predicates.map(async (predicate) => {
        return await processObjects(predicate, triple[predicate] as RDFResource[]);
      })
    );
  } else if (predicates.length === 1) {
    const predicate = predicates[0];
    if (!predicate) return;

    if ((triple[predicate] as RDFValue[])?.[0]?.["@id"] || (triple[predicate] as RDFValue[])?.[0]?.["@value"]) {
      return;
    }

    return await processObjects(predicate, triple[predicate] as RDFResource[]);
  } else {
    return [{ ...triple, id: uuidv4() }];
  }
};

// Function to handle ontology-based processing
const processOntologyBased = async (triples: RDFResource[], ontologyUrls: string[], rdfResources: RDFResource[]) => {
  return await Promise.all(
    triples.map(async (triple) => {
      if (Object.keys(triple).includes("http://www.w3.org/2000/01/rdf-schema#comment")) {
        const label = getLabel("subject", triple, rdfResources);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get_classes`, {
          ontologies: ontologyUrls,
          query: label,
        });
        const className = (response.data as { class: string; ontology_url: string; score: number }[])[0]?.class;
        triple["@type"] = [className];
        return triple;
      }

      if ((triple["@type"] as string[])[0] === "http://www.w3.org/2002/07/owl#ObjectProperty") {
        return triple;
      } else {
        const label = getLabel("object", triple, rdfResources);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get_classes`, {
          ontologies: ontologyUrls,
          query: label,
        });
        const className = (response.data as { class: string; ontology_url: string; score: number }[])[0]?.class;
        triple["@type"] = [className];
        return triple;
      }
    })
  );
};

// Main function to handle generated triples
export const handleSubmitGeneratedTriples = async ({
  setStatus,
  pdf2triplesGenerateBasedOntology,
  pdf2triplesGenerateFullText: shouldUseFullText,
  pdf2TriplesGeneratePartialText: partialText,
  pdf,
  prompts,
  topics,
  ontologyUrls,
  prefixes,
  setLocalTriples,
  rdfResources,
}: {
  setStatus: (status: Status) => void;
  pdf2triplesGenerateBasedOntology: boolean;
  pdf2triplesGenerateFullText: boolean;
  pdf2TriplesGeneratePartialText: string;
  pdf: ExtractedTextResponse | null;
  prompts: {
    label: string;
    description: string;
    prompt: string;
  }[];
  topics: string[];
  ontologyUrls: (string | undefined)[];
  prefixes: Prefix[];
  setLocalTriples: (triples: RDFResource[]) => void;
  rdfResources: RDFResource[];
}) => {
  setStatus({ value: "loading" });

  try {
    const sourceText: ExtractedTextResponse | null = shouldUseFullText
      ? pdf
      : {
        title: pdf?.title,
        text: partialText,
        error: pdf?.error,
      };

    const promptLabel = "Generate Triples";

    if (!sourceText?.text) {
      setStatus({
        value: "error",
        message: "No text could be generated. Please try again.",
      });
      return;
    }

    let prompt = prompts
      .find((p) => p.label === promptLabel)
      ?.prompt.replace("<placeholder_text>", sourceText?.text)
      .replace("<placeholder_topics>", `["${topics.join('","')}"]`);

    const response = await generateTriples(prompt ?? '', pdf);

    if (response?.error) {
      setStatus({
        value: "error",
        message: response.error?.message,
      });
      return;
    }

    if (response.triples?.length === 0) {
      setStatus({
        value: "error",
        message: "No triples could be generated. Please try again.",
      });
      return;
    }

    const splittedTriples: RDFResource[] = [];

    await Promise.all(
      response.triples.map(async (triple: RDFResource) => {
        const processedTriples = await processTriple(triple, pdf?.id);
        if (!processedTriples) return;
        const tp = structuredClone(processedTriples) as RDFResource[]
        const flatted = tp.flat(Infinity)
        // @ts-ignore
        splittedTriples.push(flatted);
      })
    );
    const flattenedTriples = splittedTriples.flat(Infinity);

    let updatedTriples = structuredClone(flattenedTriples);
    if (pdf2triplesGenerateBasedOntology && ontologyUrls.length > 0) {
      updatedTriples = await processOntologyBased(splittedTriples, ontologyUrls as string[], rdfResources);
    }

    setStatus({ value: "success" });
    setLocalTriples(updatedTriples);
  } catch (error) {
    console.error(error);
    setStatus({
      value: "error",
      message: "An error occurred. Please try again.",
    });
  }
};
