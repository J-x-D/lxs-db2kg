import axios from "axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { useStore } from "store/store";

interface Ontologies {
  uri: string;
  prefix: string;
  name: string;
}

export default function useFetchOntologies() {
  const { setAlert } = useStore();
  const url = "https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/list";

  const [loadingOntologiesOptions, setLoadingOntologiesOptions] =
    useState(false);
  const [error, setError] = useState("");
  const [ontologiesOptions, setOntologiesOptions] = useState<string[]>([]);

  async function fetchOntologies() {
    try {
      setLoadingOntologiesOptions(true);
      const response = await axios.get(url);
      const ontologiesObject: Ontologies[] = await response?.data;

      const transformedOntologiesOptions: string[] = ontologiesObject.map(
        (ontology: Ontologies) => ontology.uri
      );
      setOntologiesOptions(transformedOntologiesOptions);
    } catch (error) {
      const err = error as AxiosError;
      console.error(error);
      setError(err.message);
      setAlert({
        type: "error",
        message: `Error while fetching ontologies`,
        open: true,
      });
    }
    setLoadingOntologiesOptions(false);
  }

  return {
    ontologiesOptions,
    loadingOntologiesOptions,
    error,
    fetchOntologies,
  };
}
