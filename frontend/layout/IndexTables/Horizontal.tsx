import { Grid } from "@mui/material";
import React from "react";

interface HorizontalProps {
  children: React.ReactNode;
}

export default function Horizontal({ children }: HorizontalProps) {
  return (
    <Grid display={"grid"} boxSizing={"border-box"} gridTemplateColumns={"1fr 1fr"} width={"100%"} gap={4} height={"100%"}>
      {children}
    </Grid>
  );
}
