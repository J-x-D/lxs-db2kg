import React from "react";
import ToggleButtonBase from "../ToggleButtonBase";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useStore } from "store/store";

export default function DeleteToggleButton() {
  const [open, setOpen] = React.useState(false);

  const { selectedTable, deleteRmlRule, rmlRules, globalDisabled } = useStore();

  function handleDeleteButtonClick() {
    deleteRmlRule(selectedTable);
    setOpen(false);
  }

  const disabled = !selectedTable || !rmlRules[selectedTable] || globalDisabled;

  return (
    <>
      <ToggleButtonBase
        element={<DeleteOutlineIcon color={disabled ? "disabled" : "error"} />}
        value="delete"
        disabled={disabled}
        handleButtonClick={() => setOpen(true)}
        tooltipLabel="Delete RML Rules"
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle color="error">
          Delete RML Rules for {selectedTable}
        </DialogTitle>
        <DialogContent color="error">
          Do you want to delete all RML rules for the table {selectedTable}?
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            disableElevation
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button color="error" onClick={() => handleDeleteButtonClick()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
