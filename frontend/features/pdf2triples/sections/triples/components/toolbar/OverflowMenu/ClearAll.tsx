import React from "react";
import BaseOverflowMenuItem from "./base/BaseOverflowMenuItem";
import { ClearAllOutlined } from "@mui/icons-material";
import { initialState, useStore } from "store/store";

export default function ClearAll() {
  const { handleDeleteLxsTriples, handleDeletePdf, setPrompts } = useStore();
  return (
    <BaseOverflowMenuItem
      handleClick={() => {
        handleDeleteLxsTriples();
        handleDeletePdf();
        localStorage.clear();
        setPrompts(initialState.prompts);
      }}
      tooltipLabel={"Settings"}
    >
      <ClearAllOutlined color="primary" /> Clear All
    </BaseOverflowMenuItem>
  );
}
