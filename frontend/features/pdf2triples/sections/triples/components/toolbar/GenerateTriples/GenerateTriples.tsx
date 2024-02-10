import React, { useState } from "react";
import GenerateTriplesToggleButton from "./GenerateTriplesToggleButton";
import GenerateTriplesDialog from "./dialog/GenerateTriplesDialog";
import { useStore } from "store/store";

export default function GenerateTriples() {
  const {
    pdf2triplesGlobalPdf: pdf,
    setPdf2triplesLxsSelectedText,
    setSelectedRDFResource,
  } = useStore();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setPdf2triplesLxsSelectedText("");
    setSelectedRDFResource(undefined);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <GenerateTriplesToggleButton
        isDialogOpen={open}
        handleButtonClick={handleOpen}
      />
      <GenerateTriplesDialog open={open} handleClose={handleClose} />
    </>
  );
}
