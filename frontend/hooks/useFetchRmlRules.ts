import { useStore } from "store/store";
import useFetchRelatedOntology from "hooks/useFetchRelatedOntology";
import { Graph } from "../types/RmlRulesTypes";
import axios from "axios";
import { backOff } from "exponential-backoff";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/rml_rule";

export default function useFetchRmlRules(autoFetch?: boolean) {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    ontologyUrls,
    selectedTable,
    database,
    dbConnectionString,
    allTableNames,
    tablesForSchemaNames,
    setRmlRules: setRmlRuleInStore,
    rmlRules,
    schema,
    prefixes,
    globalDisabled,
    setGlobalDisabled,
    setAlert
  } = useStore();

  const schemaIndex = database.schemaTableColumnMap.findIndex(
    (schemaTable) => schemaTable.schema === schema);


  const { fetchRelatedOntology } = useFetchRelatedOntology(ontologyUrls);

  async function fetchRmlRule(table: string): Promise<Graph | undefined> {
    // if any of the required parameters is not set, don't fetch
    console.log(schema);
    if (!ontologyUrls || !database || !dbConnectionString) return;

    try {
      if (!autoFetch) setGlobalDisabled(true);
      setLoading(true);

      // fetch related ontology
      // const ontologies = await fetchRelatedOntology(`table: ${table}, columns: ${columns}`);
      const ontologies = await fetchRelatedOntology(table);

      const databaseSchema = database.schemaTableColumnMap.filter(
        (schemaTable) => schemaTable.schema === schema
      );

      console.log(databaseSchema);

      const response = await axios.post(url, {
        database: { schemaTableColumnMap: [databaseSchema] },
        logicalSource: dbConnectionString,
        table,
        ontologies,
        schema,
        prefixes,
      });

      const data = response?.data;
      if (data === undefined || data === null || data.length === 0) {
        setLoading(false);
        return;
      }

      setRmlRuleInStore(table, data);
      if (!autoFetch) setGlobalDisabled(false);
      setLoading(false);
      return data;
    } catch (error) {
      const err = error as AxiosError;

      setLoading(false);
      if (err?.response?.status === 429) {
        await backOff(() => fetchRmlRule(table), {
          delayFirstAttempt: true,
          jitter: "full",
          numOfAttempts: 5,
          startingDelay: 5 * 1000,
        });
      } else {
        setAlert({
          open: true,
          message: "Error while fetching RML rules for table " + table,
          type: "error",
        })
      }
      setError(err.message);
    } finally {
      if (!autoFetch) setGlobalDisabled(false);
      setLoading(false);
    }
  }

  async function fetchRmlRulesRecursive(
    tableColumns: string[],
    index = 0
  ): Promise<void> {
    if (index >= tableColumns.length) {
      return;
    }

    const tableName = tableColumns[index];


    // if rmlRules[selectedTable] is already set, don't fetch again
    if (rmlRules[tableColumns[index]]) {
      setProgress((index / tableColumns.length) * 100);
      return fetchRmlRulesRecursive(tableColumns, index + 1);
    }



    await new Promise((r) => setTimeout(r, 3000));

    await fetchRmlRule(tableName);
    setProgress((index / tableColumns.length) * 100);

    return fetchRmlRulesRecursive(tableColumns, index + 1);
  }

  async function autoFetchRmlRules() {
    setGlobalDisabled(true);
    // Call the function with the array of allTableColumns
    await fetchRmlRulesRecursive(tablesForSchemaNames);
    setGlobalDisabled(false);
  }

  useEffect(() => {
    if (autoFetch) {
      autoFetchRmlRules();
    }
    return () => { };
  }, [autoFetch, tablesForSchemaNames]);

  return {
    loading,
    rmlRules,
    globalDisabled,
    error,
    fetchRmlRule,
    progress,
    autoFetchRmlRules,
  };
}
