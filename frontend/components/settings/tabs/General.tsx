import {
  Collapse,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import dynamic from "next/dynamic";
import { useStore } from "store/store";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";


import AdvancedModeToggleSwitch from "components/ToggleSwitches/settings/general/AdvancedModeToggleSwitch";
import ShowGuidanceToggleSwitch from "components/ToggleSwitches/settings/general/ShowGuidanceToggleSwitch";
import TableRowsNumberSelect from "components/NumberSelects/settings/TableRowsNumberSelect";
import LayoutOrientationToggleButtonGroup from "components/ToggleButtonGroup/settings/LayoutOrientationToggleButtonGroup";
import ShowPaginationToggleSwitch from "components/ToggleSwitches/settings/general/ShowPaginationToggleSwitch";

const PrefixesAutocomplete = dynamic(
  () => import("components/settings/PrefixesAutocomplete"),
  {
    ssr: false,
  }
);

export function GeneralHeader() {
  return (
    <Stack
      direction={"row"}
      sx={{
        m: 0,
        p: 0,
      }}
      justifyContent={"space-between"}
    >
      <Typography variant="h5">General Configuration</Typography>
    </Stack>
  );
}

export default function General() {
  const { showGuidance, setShowGuidance, advancedMode, setAdvancedMode } =
    useStore();

  return (
    <>
      <GuidanceInfoAlert
        title="Prefixes"
        text="You can add prefixes to the application here. These prefixes will be used in the RML rules."
      >
        <PrefixesAutocomplete />
      </GuidanceInfoAlert>
      <ShowGuidanceToggleSwitch />
      <AdvancedModeToggleSwitch />
      <Collapse id="advanced-mode-section" in={advancedMode} unmountOnExit>
        <Stack gap={"24px"} marginLeft={"40px"}>
          <ShowPaginationToggleSwitch />
          <TableRowsNumberSelect />
          <LayoutOrientationToggleButtonGroup />
        </Stack>
      </Collapse>
    </>
  );
}
