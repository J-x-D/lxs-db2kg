import { useStore } from "store/store";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { SetStateAction } from "react";
import GuidanceInfoAlert from "../Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

interface EditOntologyClassProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  currentOntologyClass?: string;
}

export default function EditOntologyClass({
  open,
  setOpen,
  currentOntologyClass,
}: EditOntologyClassProps) {
  const { setAlert, rmlRules, selectedTable, setRmlRules } = useStore();
  const [newOntologyClassValue, setNewOntologyClassValue] =
    React.useState<string>("");
  async function handleUpdateOntologyClass() {
    try {
      if (newOntologyClassValue === "") {
        setAlert({
          open: true,
          message: "Please enter a new ontology class",
          type: "error",
        });
        return;
      }
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/update_ontology_class",
        {
          old_ontology_class: currentOntologyClass,
          new_ontology_class: newOntologyClassValue,
          rml_rule: rmlRules[selectedTable],
        },
      );
      setOpen(false);
      setAlert({
        open: true,
        message: `Updated ontology class from ${currentOntologyClass} to ${newOntologyClassValue}`,
        type: "success",
      });
      setNewOntologyClassValue("");
      setRmlRules(selectedTable, response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: "Could not update ontology class",
        type: "error",
      });

      console.log(error);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle>Edit Ontology Class</DialogTitle>
      <DialogContent>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingY: 1,
            gap: 2,
          }}
        >
          <GuidanceInfoAlert
            title="Edit Ontology Class"
            text="Here you can edit the ontology class of the selected table."
          />
          <TextField
            fullWidth
            label="Ontology Class"
            variant="outlined"
            placeholder={currentOntologyClass || ""}
            value={newOntologyClassValue}
            onChange={(e) => setNewOntologyClassValue(e.target.value as string)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent={"end"}>
          <Button
            onClick={() => {
              setOpen(false);
              setNewOntologyClassValue("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdateOntologyClass()}
            variant="contained"
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
