import { useStore } from "store/store";
import { Box, Card, Typography } from "@mui/material";
import React from "react";
import useFetchTableInfo from "hooks/useFetchTableInfo";
import { DataGrid } from "@mui/x-data-grid";
import CustomColumnMenu from "./CustomColumnMenu";
import GenerateRmlRuleForTableButton from "../GenerateRmlRuleForTableButton";

export default function DisplayTable() {
  const { selectedTable, dbConnectionString, schema } = useStore();

  const { tableInfo } = useFetchTableInfo();

  const columns =
    tableInfo?.columns.map((e) => ({
      field: e,
      headerName: e,
      width: 200,
      sortable: false,
    })) || [];

  return (
    <Box
      component="div"
      sx={{
        width: "100%",
        height: "calc(100vh - 4rem)",
        marginLeft: "240px",
        padding: "2rem",
        background: "#f5f5f5",
      }}
    >
      <Card sx={{ width: "100%", mb: 2 }} variant="elevation">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1rem 0 0",
          }}
        >
          <Typography sx={{ padding: "1rem" }} variant="h6">
            {selectedTable.toUpperCase()}
          </Typography>
          <GenerateRmlRuleForTableButton />
        </div>
        <DataGrid
          style={{ margin: "1rem" }}
          rows={tableInfo?.rows || []}
          columns={columns}
          autoHeight
          slots={{
            columnMenu: CustomColumnMenu,
          }}
        />
      </Card>
    </Box>
  );
}
