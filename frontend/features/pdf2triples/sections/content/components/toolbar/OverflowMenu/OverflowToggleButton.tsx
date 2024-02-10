import React from "react";
import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import { MoreVert } from "@mui/icons-material";

export default function OverflowToggleButton({
  handleClick,
}: {
  handleClick: (button: React.MouseEvent | undefined) => void;
}) {
  return (
    <ToggleButtonBase
      width="42px"
      height="42px"
      element={<MoreVert />}
      value="overflow-menu"
      handleButtonClick={handleClick}
    />
  );
}
