import { Stack } from "@mui/material";
import React from "react";

interface VerticalProps {
  children: React.ReactNode;
}

export default function Vertical({ children }: VerticalProps) {
  return (
    <Stack width={"100%"} gap={4}>
      {children}
    </Stack>
  );
}
