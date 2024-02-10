import { Triples } from "types/Triples";
import axios from "axios";

export type GroupedTriples = {
  [key: string]: Triples[];
};

export default async function fetchTriples({
  rmlRules,
  selectedTable,
  setLoading,
  setTriples,
  setAlert,
}: {
  rmlRules: any;
  selectedTable: string;
  setLoading: any;
  setTriples: any;
  setAlert: any;
}) {
  setLoading(true);
  try {
    const result = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/get_rml_rule_triples",
      rmlRules[selectedTable]
    );

    const groupedTriples: GroupedTriples = result.data
      .filter((triple: Triples) => triple.object !== "id")
      .reduce((acc: any, triple: Triples) => {
        if (acc[triple.subject]) {
          acc[triple.subject].push(triple);
        } else {
          acc[triple.subject] = [triple];
        }
        return acc;
      }, {} as { [key: string]: Triples[] });

    setTriples(groupedTriples);
  } catch (error) {
    setAlert({
      open: true,
      message: "Could not fetch triples",
      type: "error",
    });
  }
  setLoading(false);
}
