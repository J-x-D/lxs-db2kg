import OneSideDialog from "features/pdf2triples/components/OneSideDialog";
import { FileUploadOutlined } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import { useStore } from "store/store";

import OntologiesList from "components/settings/ontologies/OntologiesList";
import PrefixesAutocomplete from "components/settings/PrefixesAutocomplete";

export default function ImportOntologiesDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const { createdEmbeddings, setCreatedEmbeddings } = useStore();

  useEffect(() => {
    setCreatedEmbeddings(false);
  }, []);

  const importOntologies = () => {
    handleClose();
  };

  return (
    <OneSideDialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FileUploadOutlined /> Import Ontologies
      </DialogTitle>
      <DialogContent
        sx={{
          gap: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <DialogContentText>
          You can import URLs of ontologies to use in the generation of triples.
        </DialogContentText>
        <OntologiesList />
        <Divider />
        <DialogContentText>
          You can further select common prefixes that will be used to provide
          predicate suggestions.
        </DialogContentText>
        <PrefixesAutocomplete />
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Tooltip
            title={
              !createdEmbeddings
                ? "Please enter at least one ontology and create embeddings."
                : ""
            }
            placement="left"
          >
            <span>
              <Button
                variant="contained"
                color="primary"
                onClick={importOntologies}
                // disabled={!createdEmbeddings}
              >
                Import
              </Button>
            </span>
          </Tooltip>
        </DialogActions>
      </DialogContent>
    </OneSideDialog>
  );
}
