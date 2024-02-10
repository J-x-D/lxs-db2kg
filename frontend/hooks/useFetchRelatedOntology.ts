import { useState } from "react";
import axios, { AxiosError } from "axios";
import { RDFResource } from "features/pdf2triples/types/triple";

export default function useFetchRelatedOntology(
  ontologyUrls: (string | undefined)[],
) {
  const [ontologies, setOntologies] = useState<RDFResource[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchRelatedOntology(
    tableName: string,
  ): Promise<RDFResource[] | undefined> {
    const url =
      process.env.NEXT_PUBLIC_BACKEND_URL + "/get_semantically_closest";
    try {
      setLoading(true);
      const response = (await axios.post(url, {
        search: tableName,
        urls: ontologyUrls,
      })) as { data: RDFResource[] };
      setOntologies(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message);
    }
  }

  return { ontologies, loading, error, fetchRelatedOntology };
}
