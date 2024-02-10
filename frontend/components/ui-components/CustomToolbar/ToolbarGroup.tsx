import React from "react";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToolbarGroup({
  children,
  minWidth = "56px",
  height = "56px",
}: {
  children: React.ReactNode;
  minWidth?: string;
  height?: string;
}): JSX.Element {
  return (
    <ToggleButtonGroup
      sx={{
        minWidth,
        height: height,
        overflow: "hidden",
      }}
    >
      {children}
    </ToggleButtonGroup>
  );
}
