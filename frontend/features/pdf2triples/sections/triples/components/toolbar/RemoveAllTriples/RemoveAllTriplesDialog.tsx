import { useStore } from "store/store";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import OneSideDialog from "../../../../../components/OneSideDialog";

export default function RemoveAllTriplesDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const { handleDeleteLxsTriples } = useStore();

  const handleSubmit = () => {
    localStorage.removeItem("colors");
    handleDeleteLxsTriples();
    handleClose();
  };

  return (
    <OneSideDialog open={open} onClose={handleClose}>
      <DialogTitle>Remove All Triples</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove all triples? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} autoFocus>
          Remove All Triples
        </Button>
      </DialogActions>
    </OneSideDialog>
  );
}
