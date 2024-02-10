import { useStore } from "store/store";
import React from "react";
import Vertical from "./Vertical";
import Horizontal from "./Horizontal";

interface DecideViewModeProps {
  children: React.ReactNode;
}

export default function DecideViewMode({ children }: DecideViewModeProps) {
  const { tablesOrientation, setTablesOrientation } = useStore();
  return tablesOrientation === "vertical" ? (
    <Vertical>{children}</Vertical>
  ) : (
    <Horizontal>{children}</Horizontal>
  );
}
