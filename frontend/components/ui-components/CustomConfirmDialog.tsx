import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
} from "@mui/material";
import theme from "../../src/theme";

export default function CustomConfirmDialog({
  open,
  setOpen,
  title,
  content,
  onConfirm,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  content: string;
  onConfirm: () => void;
}) {
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: theme.shape.borderRadius + "px",
            color: "#000000ff",
            boxShadow: 2,
            padding: "12px",
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button onClick={() => setOpen(false)} variant="text" >
            Cancel
          </Button>
          <Button onClick={() => onConfirm()} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
