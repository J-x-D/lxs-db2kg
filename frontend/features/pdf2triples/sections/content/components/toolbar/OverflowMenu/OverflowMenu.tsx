import { checkHasAnyTriples } from "features/pdf2triples/sections/triples/utils/checks/hasAnyTriples";
import { hasImportedPdf } from "features/pdf2triples/sections/triples/utils/checks/hasImportedPdf";
import { useStore } from "store/store";
import {
  EditOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Menu,
  MenuItem,
  MenuItemProps,
  MenuProps,
  Tooltip,
} from "@mui/material";
import React from "react";

const CustomMenuItem = React.forwardRef<MenuItemProps, any>((props, ref) => (
  <MenuItem
    ref={ref}
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "1rem",
      height: "48px",
    }}
    {...props}
  />
));
CustomMenuItem.displayName = "CustomMenuItem";

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

function EditPdf({ handleClose }: { handleClose: () => void }) {
  const {
    pdf2triplesGlobalPdf,
    pdf2triplesPdfEditMode,
    setPdf2triplesPdfEditMode,
    rdfResources,
  } = useStore();
  const hasTriples = checkHasAnyTriples(rdfResources);
  const hasPdf = hasImportedPdf(pdf2triplesGlobalPdf);

  const hasEditModeEnabled = !!pdf2triplesPdfEditMode;

  const disabled = hasTriples || !hasPdf || hasEditModeEnabled;

  const computeTooltipLabel = () => {
    switch (true) {
      case !hasPdf:
        return "Please import a PDF to edit it";
      case hasTriples:
        return "You cannot edit a PDF that has triples";
      case hasEditModeEnabled:
        return "Edit Mode is already enabled";
      default:
        return "Enable Edit Mode";
    }
  };

  const handleClick = () => {
    if (disabled) return;
    setPdf2triplesPdfEditMode(true);
    handleClose();
  };

  return (
    <Tooltip
      title={computeTooltipLabel()}
      placement={hasPdf ? "left-start" : "left"}
    >
      <span>
        <CustomMenuItem disabled={disabled} onClick={handleClick}>
          <EditOutlined color={disabled ? "disabled" : "primary"} />
          Edit text
        </CustomMenuItem>
      </span>
    </Tooltip>
  );
}

function HideTriples({ handleClose }: { handleClose: () => void }) {
  const {
    pdf2triplesHideTriples: hideTriples,
    setPdf2triplesHideTriples,
    pdf2triplesGlobalPdf,
  } = useStore();

  const computeTooltipLabel = () => {
    if (hideTriples) {
      return "Triples are currently hidden";
    }
    return "Triples are currently visible";
  };

  const handleToggleHideTriples = () => {
    handleClose();
    setTimeout(() => {
      setPdf2triplesHideTriples(!hideTriples);
    }, 200);
  };

  return (
    <Tooltip title={computeTooltipLabel()} placement={"bottom"}>
      <span>
        <CustomMenuItem onClick={handleToggleHideTriples}>
          {hideTriples ? (
            <VisibilityOutlined color="primary" />
          ) : (
            <VisibilityOffOutlined color="primary" />
          )}
          {hideTriples ? "Show Triples" : "Hide Triples"}
        </CustomMenuItem>
      </span>
    </Tooltip>
  );
}

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
      <EditPdf handleClose={handleClose} />
      <HideTriples handleClose={handleClose} />
    </CustomMenu>
  );
}
