import { Menu, MenuProps } from "@mui/material";
import React from "react";
import ImportTriples from "./importTriples/ImportTriples";
import ImportOntologies from "./importOntologies/ImportOntologies";
import Settings from "./Settings/Settings";
import ClearAll from "./ClearAll";
// import EditTopics from "./Topics/EditTopics";

const CustomMenu = React.forwardRef<MenuProps, any>((props, ref) => (
  <Menu
    ref={ref}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    sx={{
      marginTop: ".5rem",
    }}
    {...props}
  />
));
CustomMenu.displayName = "CustomMenu";

export default function OverflowMenu({
  anchorEl,
  open,
  handleClose,
}: {
  anchorEl: Element | null;
  open: boolean;
  handleClose: () => void;
}) {
  return (
    <CustomMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <Settings handleClose={handleClose} />
      <ImportTriples handleClose={handleClose} />
      <ImportOntologies handleClose={handleClose} />
      {/* <EditTopics handleClose={handleClose} /> */}
      <ClearAll />
    </CustomMenu>
  );
}
