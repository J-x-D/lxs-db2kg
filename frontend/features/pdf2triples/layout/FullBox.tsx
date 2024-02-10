import { Box } from "@mui/material";
import React from "react";
import { headerHeight } from "./Header";

export default function FullBox({
  children,
  background,
}: {
  children?: React.ReactNode;
  background?: string;
}) {
  return (
    <Box
      component="div"
      sx={{
        width: "100%",
        maxWidth: "50vw",
        height: "100%",
        minHeight: "calc(100vh - " + headerHeight + "px)",
        paddingX: 4,
        paddingY: 2,
        boxSizing: "border-box",
        position: "relative",
      }}
      bgcolor={background ?? "background.default"}
    >
      {children}
    </Box>
  );
}
