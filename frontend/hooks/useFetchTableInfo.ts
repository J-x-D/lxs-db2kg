import axios from "axios";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useStore } from "store/store";
import { TableInfo } from "types/SchemaTableColumnMap";

export default function useFetchTableInfo() {
  const { setAlert, dbConnectionString, schema, selectedTable } = useStore();
  const url = "/api/getTableInfo";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableInfo, setTableInfo] = useState<TableInfo>({
    columns: [],
    rows: [],
  });

  async function fetchTableInfo(table: string): Promise<TableInfo> {
    console.log(table);
    if (!dbConnectionString || !table || !schema) {
      console.error(dbConnectionString, table, schema);
      return { columns: [], rows: [] };
    }

    try {
      setLoading(true);
      const timeoutPromise = new Promise<{ data: TableInfo }>((_, reject) => {
        setTimeout(() => {
          if (loading) {
            reject(new Error("Request timed out"));
          }
        }, 10000); // 10 seconds timeout
      });

      const requestPromise = axios.post(url, {
        connection_string: dbConnectionString,
        schema: schema,
        table: table,
      }) as Promise<{ data: TableInfo }>;

      const response = await Promise.race([requestPromise, timeoutPromise]);

      if ("data" in response) {
        /* console.table(response.data.rows, response.data.columns); */
        setTableInfo(response.data);
        setLoading(false);
        return response.data;
      }

      // setTableInfo(response);
      setLoading(false);
      setError("");

      throw new Error("Invalid response received");

      // return response;
    } catch (error) {
      const err = error as AxiosError;
      setError(err.message || "Error while fetching the DB tables");
      setLoading(false);
      setAlert({
        type: "error",
        message: err.message || "Error while fetching the DB tables",
        open: true,
      });
      return { columns: [], rows: [] };
    }
  }

  // fetch initial database schema so that the method doesn't have to be called manually
  useEffect(() => {
    fetchTableInfo(selectedTable);
    return () => { };
  }, [selectedTable, schema, dbConnectionString]);

  return { tableInfo, loading, error, fetchTableInfo };
}
