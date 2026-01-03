import { Stack } from "@mui/material";
import React from "react";
import ToolbarGroup from "components/ui-components/CustomToolbar/ToolbarGroup";

function LeftSide() {
  return (
    <>
      {/* Add content-related toolbar items here if needed */}
    </>
  );
}

function RightSide() {
  return (
    <>
      {/* Add content-related toolbar items here if needed */}
    </>
  );
}

export default function TextInputToolbar() {
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
