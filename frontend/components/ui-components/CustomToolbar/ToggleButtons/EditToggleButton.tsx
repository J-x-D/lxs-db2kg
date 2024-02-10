import React from "react";
import ToggleButtonBase from "../ToggleButtonBase";
import { Add } from "@mui/icons-material";
import { useStore } from "store/store";

export default function EditToggleButton({
  handleButtonClick,
}: {
  handleButtonClick: () => void;
}) {
  const { selectedTable, rmlRules, globalDisabled } = useStore();
  const disabled = !selectedTable || !rmlRules[selectedTable] || globalDisabled;

  function handleEditButtonClick() {
    handleButtonClick();
  }

  return (
    <ToggleButtonBase
      element={<Add />}
      value="edit"
      disabled={disabled}
      handleButtonClick={handleEditButtonClick}
      tooltipLabel="Create Triple"
      borderRadius="start"
    />
  );
}
