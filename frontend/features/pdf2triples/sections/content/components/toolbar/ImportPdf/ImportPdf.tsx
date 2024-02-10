import React from "react";
import ImportPdfToggleButton from "./ImportPdfToggleButton";
import ImportTextDialog from "./Dialog/ImportTextDialog";

export default function ImportPdf() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  return (
    <>
      <ImportPdfToggleButton handleClick={() => setDialogOpen(true)} />
      <ImportTextDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
    </>
  );
}
