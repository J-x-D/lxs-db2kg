import axios from "axios";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useStore } from "store/store";
import { SchemaTableColumnMap } from "types/SchemaTableColumnMap";

export default function useFetchDatabaseSchema() {
  const {
    setAlert,
    dbConnectionString,
    setSchemas: setGlobalSchemas,
    schema,
    database,
    setDatabase,
    allTableNames,
    setAllTableNames,
    tablesForSchemaNames,
    setTablesForSchemaNames,
  } = useStore();

  const url =
    "/api/getDbTables?connection_string=" +
    encodeURIComponent(dbConnectionString);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schemas, setSchemas] = useState<string[]>([]);

  async function fetchDatabaseSchema(newSchema?: string) {
    try {
      const localSchema = newSchema ? newSchema : schema;
      setLoading(true);
      const response = (await axios.get(url)) as { data: SchemaTableColumnMap };

      const allTableNames = response.data.schemaTableColumnMap.flatMap(
        (schema) => schema.tables.map((table) => table.tableName as string)
      );
      const schemaList = response.data.schemaTableColumnMap.map(
        (e) => e.schema
      );
      setSchemas(schemaList);
      setGlobalSchemas(schemaList);
      setDatabase(response.data);
      const localTablesForSchemaNames = response.data.schemaTableColumnMap
        .filter((e) => e.schema === localSchema)
        .flatMap((e) => e.tables.map((e) => e.tableName as string));

      setAllTableNames(allTableNames);
      setTablesForSchemaNames(localTablesForSchemaNames);
      setLoading(false);
      return newSchema;
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message);
      setLoading(false);
      setAlert({
        type: "error",
        message: "Error while fetching the DB schema",
        open: true,
      });
    }
    return;
  }

  // fetch initial database schema so that the method doesn't have to be called manually
  useEffect(() => {
    fetchDatabaseSchema();
    return () => {};
  }, []);

  return {
    schemas,
    database,
    allTableNames,
    tablesForSchemaNames,
    loading,
    error,
    fetchDatabaseSchema,
  };
}
