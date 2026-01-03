import ToolbarGroup from "components/ui-components/CustomToolbar/ToolbarGroup";

import { Stack } from "@mui/material";
import React from "react";
// import AddTriple from "./components/toolbar/AddTriple/AddTriple";
import RemoveAllTriples from "./components/toolbar/RemoveAllTriples/RemoveAllTriples";
import RemoveTriple from "./components/toolbar/RemoveTriple/RemoveTriple";
import GenerateTriples from "./components/toolbar/GenerateTriples/GenerateTriples";
import DownloadTriples from "./components/toolbar/DownloadTriples/DownloadTriples";
import StatusTriples from "./components/toolbar/StatusTriples/StatusTriples";
import OverflowTripleHeader from "./components/toolbar/OverflowMenu/Overflow";
import PreviewTriples from "./components/toolbar/PreviewTriples/PreviewTriples";
import AddTriple from "./components/toolbar/AddTriple/AddTriple";

function LeftSide() {
  return (
    <>
      <ToolbarGroup minWidth="42px" height="42px">
        <GenerateTriples />
      </ToolbarGroup>
      <ToolbarGroup minWidth="42px" height="42px">
        <RemoveTriple />
        <AddTriple />
      </ToolbarGroup>
      <ToolbarGroup minWidth="42px" height="42px">
        <RemoveAllTriples />
      </ToolbarGroup>
    </>
  );
}

function RightSide() {
  return (
    <>
      <StatusTriples />
      <ToolbarGroup minWidth="42px" height="42px">
        <PreviewTriples />
        <DownloadTriples />
      </ToolbarGroup>
      <OverflowTripleHeader />
    </>
  );
}

export default function TriplesToolbar() {
  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={2}
      width={"100%"}
    >
      <Stack direction="row" gap={2}>
        <LeftSide />
      </Stack>
      <Stack direction="row" alignItems={"center"} gap={2}>
        <RightSide />
      </Stack>
    </Stack>
  );
}
