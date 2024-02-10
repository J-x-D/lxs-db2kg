import React from "react";
import ToggleButtonBase from "../ToggleButtonBase";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import useFetchRmlRules from "hooks/useFetchRmlRules";
import { useStore } from "store/store";

export default function AutoGenToggleButton() {
  const { fetchRmlRule } = useFetchRmlRules();

  const { selectedTable, globalDisabled } = useStore();

  return (
    <ToggleButtonBase
      element={<AutoAwesomeIcon />}
      value="autoGenerate"
      disabled={globalDisabled}
      loading={globalDisabled}
      handleButtonClick={() => fetchRmlRule(selectedTable)}
      tooltipLabel="Auto-Generate RML Rules"
    />
  );
}
