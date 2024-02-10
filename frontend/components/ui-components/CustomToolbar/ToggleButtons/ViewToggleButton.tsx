import React, { useState } from "react";
import ToggleButtonBase from "../ToggleButtonBase";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomRuleViewDialog from "../../CustomRuleViewDialog";
import { useStore } from "store/store";

export default function ViewToggleButton() {
  const { selectedTable, rmlRules, globalDisabled } = useStore();
  const [open, setOpen] = useState(false);

  function handleCreateRMLRules() {
    setOpen(false);
    /* TODO add function to create rml rules */
  }

  const disabled = !selectedTable || !rmlRules[selectedTable] || globalDisabled;

  return (
    <>
      <ToggleButtonBase
        element={<VisibilityIcon />}
        value="view"
        disabled={disabled}
        handleButtonClick={() => setOpen(true)}
        tooltipLabel="View RML Rules"
        borderRadius="end"
      />
      <CustomRuleViewDialog
        open={open}
        setOpen={setOpen}
        handleCreateRMLRules={() => handleCreateRMLRules()}
      />
    </>
  );
}
