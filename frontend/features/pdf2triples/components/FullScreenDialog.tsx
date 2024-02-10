import * as React from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import theme from "src/theme";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";

function CloseNotSavedConfirmationDialog({
  handleClose,
  handleSave,
  open,
}: {
  handleClose: () => void;
  handleSave: () => void;
  open: boolean;
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Close without saving?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have unsaved changes. Are you sure you want to close?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} color="error" variant="contained">
          Close without saving
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function FullScreenDialog({
  handleClose,
  handleSave,
  title,
  saveDisabled = false,
  saveTooltipLabel = "",
  ...props
}: DialogProps & {
  title: string;
  handleClose: () => void;
  handleSave: () => void;
  saveDisabled?: boolean;
  saveTooltipLabel?: string;
}) {
  const [confirmUnsavedChangesOpen, setConfirmUnsavedChangesOpen] =
    React.useState(false);

  const handleClickClose = () =>
    saveDisabled ? handleClose() : setConfirmUnsavedChangesOpen(true);

  return (
    <Dialog fullScreen {...props}>
      <AppBar
        sx={{
          position: "relative",
          "&.MuiAppBar-root": {
            borderRadius: 0,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Toolbar>
          <Tooltip
            title={saveDisabled ? "Close" : "Close without Saving"}
            placement="bottom"
          >
            <span>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClickClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <Tooltip title={saveTooltipLabel} placement="left">
            <span>
              <Button
                autoFocus
                color="inherit"
                onClick={handleSave}
                disabled={saveDisabled}
              >
                save
              </Button>
            </span>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: theme.palette.background.default,
        }}
      >
        <CloseNotSavedConfirmationDialog
          open={confirmUnsavedChangesOpen}
          handleClose={() => setConfirmUnsavedChangesOpen(false)}
          handleSave={handleClose}
        />
        {props.children}
      </DialogContent>
    </Dialog>
  );
}
