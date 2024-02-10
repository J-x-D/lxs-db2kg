import { LoadingButton } from "@mui/lab";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
} from "@mui/material";
import React from "react";
import { useStore } from "store/store";

import OneSideDialog from "features/pdf2triples/components/OneSideDialog";
import { checkHasAnyTriples } from "features/pdf2triples/sections/triples/utils/checks/hasAnyTriples";

export default function DeletePdfDialog({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  const { rdfResources, handleDeletePdf } = useStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const sendData = async () => {
    setIsLoading(true);

    handleDeletePdf();
    new Promise((resolve) => setTimeout(resolve, 750)).then(() => {
      setIsLoading(false);
      handleClose();
    });
  };

  const hasAnyTriples = checkHasAnyTriples(rdfResources);

  return (
    <OneSideDialog open={dialogOpen} side="left" onClose={handleClose}>
      <FormControl fullWidth>
        <DialogTitle>Remove text</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <DialogContentText>
            Are you sure you want to delete this PDF from the application?{" "}
            {hasAnyTriples && (
              <>
                <br /> All triples generated from this PDF will be deleted.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton role="button" loading={isLoading} onClick={sendData}>
            Delete
          </LoadingButton>
        </DialogActions>
      </FormControl>
    </OneSideDialog>
  );
}
