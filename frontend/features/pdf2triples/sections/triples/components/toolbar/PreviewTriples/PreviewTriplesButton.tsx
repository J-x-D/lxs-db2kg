import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import { RemoveRedEye } from "@mui/icons-material";
import React from "react";

export default function PreviewTriplesButton({
  open,
  setOpen,
  disabled,
}: {
  open: boolean;
  setOpen: Function;
  disabled: boolean;
}) {
  return (
    <ToggleButtonBase
      width="42px"
      borderRadius="start"
      element={<RemoveRedEye />}
      value="file-download"
      handleButtonClick={() => setOpen(!open)}
      disabled={disabled}
      tooltipLabel={"Preview Triples"}
    />
  );
}
