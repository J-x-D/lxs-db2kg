import OneSideDialog from "features/pdf2triples/components/OneSideDialog";
import { FileUploadOutlined } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { EXPECTED_TRIPLES_STRUCTURE } from "features/pdf2triples/sections/content/types/content";
import { useStore } from "store/store";
import InputFileUpload from "./ImportTriplesFileUpload";
import JSONStructure from "features/pdf2triples/components/importing/JSONStructure";
import { RDFResource } from "features/pdf2triples/types/triple";

export default function ImportTriplesDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const { setRDFResources, rdfResources } = useStore();

  const updateTriples = () => {
    // const validatedTriples = lxsTriplesSchema.safeParse(triples);
    const validatedTriples = {
      success: true,
      error: "",
      data: triples,
    };
    if (!validatedTriples.success) {
      console.error(validatedTriples.error);
      return;
    }
    setRDFResources(validatedTriples.data);
    handleClose();
  };

  const [canImport, setCanImport] = React.useState<boolean>(false);
  const [triples, setTriples] = React.useState<RDFResource[]>([]);

  const [isHovered, setIsHovered] = useState(false);
  const [fileParent, setFileParent] = useState<File | null>(null);
  const handleFileChangeParent = (selectedFile: File | null) => {
    setFileParent(selectedFile);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHovered(true);
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHovered(true);
  };
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHovered(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHovered(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileChangeParent(droppedFiles[0]);
    }
  };

  return (
    <OneSideDialog
      open={open}
      onClose={handleClose}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      isHovered={isHovered}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FileUploadOutlined /> Import Triples
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
          You can import triples from a JSON file. This will overwrite the
          existing triples.
        </DialogContentText>
        <InputFileUpload
          setCanImport={setCanImport}
          setTriples={setTriples}
          fileParent={fileParent}
          handleFileChangeParent={handleFileChangeParent}
        />
        <JSONStructure showGuidanceAlert code={EXPECTED_TRIPLES_STRUCTURE} />
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={updateTriples}
            disabled={!canImport}
          >
            Import
          </Button>
        </DialogActions>
      </DialogContent>
    </OneSideDialog>
  );
}
