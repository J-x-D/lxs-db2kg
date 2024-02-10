import { useStore } from "store/store";
import { Triples } from "types/Triples";
import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";

export default function DeleteTripleButton({ triple }: { triple: Triples }) {
  const { selectedTable, rmlRules, setAlert, setRmlRules, globalDisabled } =
    useStore();
  const [open, setOpen] = React.useState(false);

  const deleteTriple = async () => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/delete_triple",
        {
          rml_rule: rmlRules[selectedTable],
          triple: triple,
        },
      );
      if (response.data) {
        setRmlRules(selectedTable, response.data);
        setAlert({
          open: true,
          message: "Triple deleted",
          type: "success",
        });
      } else {
        setAlert({
          open: true,
          message: "Could not delete triple",
          type: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Could not delete triple",
        type: "error",
      });
    }
    setOpen(false);
  };
  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        color="warning"
        sx={{
          background: "#FFF4EB",
          ":hover": {
            background: "#FFBC85",
          },
        }}
        disabled={globalDisabled}
      >
        <DeleteOutline />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle color="error">Delete Triple</DialogTitle>
        <DialogContent color="error">
          Do you want to delete this triple?
          <Paper variant="outlined" sx={{ m: 2, p: 2 }}>
            <Box component="div" display="flex" gap={5} flexDirection="column">
              <Typography>Subject: {triple.subject}</Typography>
              <Typography>Predicate: {triple.predicate}</Typography>
              <Typography>Object: {triple.object}</Typography>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button color="error" disableElevation onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteTriple()}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
