import { RemoveCircleOutline } from "@mui/icons-material";
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import React from "react";
import { removeSelectedTripleText } from "../../../utils/removeSelectedTripleText";
import { useStore } from "store/store";
import OneSideDialog from "../../../../../components/OneSideDialog";

export default function RemoveTripleDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const {
    rdfResources,
    setRDFResources,
    selectedRDFResource,
    setSelectedRDFResource,
  } = useStore();

  const handleClose = () => {
    setOpen(false);
  };

  function handleRemove() {
    const { triples: newTriples, error } = removeSelectedTripleText({
      triples: rdfResources,
      selectedTriple: selectedRDFResource,
    });
    if (error) {
      setErrorMsg(error);
      console.error(error);
      return;
    }
    setRDFResources(newTriples);
    setSelectedRDFResource(null);
    handleClose();
  }

  return (
    <OneSideDialog open={open} onClose={handleClose}>
      <form onSubmit={handleRemove}>
        <DialogTitle>
          <Stack direction="row" gap={2} alignItems={"center"}>
            <RemoveCircleOutline />
            Remove Selected Triple
          </Stack>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          <DialogContentText>
            Are you sure you want to remove the selected triple?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" gap={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleRemove}>Remove</Button>
          </Stack>
        </DialogActions>
      </form>
    </OneSideDialog>
  );
}
