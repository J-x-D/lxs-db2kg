import React, { useEffect } from "react";
import { useStore } from "store/store";
import { Graph, PredicateObjectMap } from "../../types/RmlRulesTypes";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import useFetchRmlRules from "hooks/useFetchRmlRules";
import useFetchDatabaseSchema from "hooks/useFetchDatabaseSchema";
import { LinearProgress, Typography } from "@mui/material";

export default function RmlRules() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);

  const { dbConnectionString } = useStore();
  const { error: dbError, loading: dbLoading } = useFetchDatabaseSchema();

  const {
    rmlRules,
    loading: ruleLoading,
    error: ruleError,
    progress,
  } = useFetchRmlRules();

  useEffect(() => {
    const localRows: any[] = [];

    rmlRules?.forEach((rule: Graph) => {
      const subject = rule["rr:subjectMap"]["rr:template"];
      rule["rr:predicateObjectMap"].forEach(
        (predicateObjectMap: PredicateObjectMap) => {
          const id = crypto.randomUUID();
          const predicate = predicateObjectMap["rr:predicate"];
          let object =
            predicateObjectMap["rr:objectMap"]["rr:column"] ??
            predicateObjectMap["rr:objectMap"]["rr:class"];

          if (object === undefined) {
            const joinCondition = predicateObjectMap["rr:objectMap"][
              "rr:joinCondition"
            ] ?? {
              "rr:parent": "",
            };
            object = joinCondition["rr:parent"];
          }

          localRows.push({ id, subject, predicate, object });
        }
      );
    });

    setRows(localRows);

    return () => {};
  }, [rmlRules]);

  const columns: GridColDef[] = [
    { field: "subject", headerName: "Subject", width: 400 },
    { field: "predicate", headerName: "Predicate", width: 400 },
    { field: "object", headerName: "Object", width: 400 },
  ];

  if (ruleLoading || dbLoading)
    return (
      <div
        style={{
          height: "90vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <LinearProgress
          variant='determinate'
          style={{
            minWidth: "50vw",
            maxWidth: "100%",
          }}
          value={progress}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant='h6'>Loading RML Rules</Typography>
          <Typography>This process may take some time</Typography>
        </div>
      </div>
    );

  if (ruleError || dbError) return <div>Error</div>;

  return (
    <div
      style={{
        height: "90vh",
      }}
    >
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
