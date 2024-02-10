"use client";

import CustomToolbar from "../../components/ui-components/CustomToolbar/Toolbar";
import CustomSideBar from "../../components/ui-components/CustomSideBar";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { Stack } from "@mui/material";
import CustomConfirmDialog from "components/ui-components/CustomConfirmDialog";
import dynamic from "next/dynamic";
import DecideViewMode from "layout/IndexTables/DecideViewMode";
import NoSSR from "components/NoSSR";

const DynamicTable = dynamic(
  () => import("components/ui-components/CustomTable"),
  {
    ssr: false,
  }
);

const DynamicRuleView = dynamic(
  () => import("components/ui-components/CustomRuleView"),
  {
    ssr: false,
  }
);

export default function MainPage() {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  return (
    <Stack
      sx={{
        boxSizing: "border-box",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: "#F7F7F7",
        overflow: "auto",
      }}
    >
      <CustomSideBar />
      <Box
        component="div"
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          p: 4,
          gap: 4,
          pl: 40,
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <NoSSR>
            <CustomToolbar />
          </NoSSR>
        </Box>
        <DecideViewMode>
          <DynamicTable />
          <DynamicRuleView />
        </DecideViewMode>
        <CustomConfirmDialog
          open={confirmDialogOpen}
          title="Delete RML Rules"
          content="Are you sure you want to delete the generated RML Rules?"
          onConfirm={() => console.log("confirm")} // TODO handle delete RML rules
          setOpen={(e) => setConfirmDialogOpen(e)}
        />
      </Box>
    </Stack>
  );
}
