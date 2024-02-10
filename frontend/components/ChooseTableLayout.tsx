import { Table } from "@mui/material";
import React from "react";

interface ChooseTableLayoutProps {
  children: React.ReactNode;
  layout: "horizontal" | "vertical";
}
export default function ChooseTableLayout({
  children,
  layout,
}: ChooseTableLayoutProps) {
  if (layout === "horizontal") {
    return <Table width={"100%"}>{children}</Table>;
  }
  return <>{children}</>;
}
