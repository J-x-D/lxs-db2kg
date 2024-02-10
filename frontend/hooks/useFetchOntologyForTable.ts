import axios from "axios";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useStore } from "store/store";

export default function useFetchOntologyForTable() {
  const { selectedTable, rmlRules, schema } = useStore();

  const url = new URL(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/get_ontology_class"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ontologyClass, setOntologyClass] = useState<string>();

  const { setAlert } = useStore();

  async function fetchOntologyClass() {
    if (!rmlRules[selectedTable]) {
      setOntologyClass(undefined);
      return;
    }

    try {
      setLoading(true);
      const response = (await axios.post(url.toString(), {
        rule: rmlRules[selectedTable],
        table_name: `${schema}.${selectedTable}`,
      })) as { data: string };

      setOntologyClass(response.data);
      setLoading(false);
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
      setOntologyClass(undefined);
      setError(err.message);
      setLoading(false);
      setAlert({
        type: "error",
        message: "Error while fetching the ontology class",
        open: true,
      });
    }
  }

  // fetch initial database schema so that the method doesn't have to be called manually
  useEffect(() => {
    fetchOntologyClass();
    return () => {};
  }, [selectedTable, rmlRules]);

  return { ontologyClass, loading, error, fetchOntologyClass };
}
