import React from "react";
import DeletePdfToggleButton from "./DeletePdfToggleButton";
import DeletePdfDialog from "./Dialog/DeletePdfDialog";

export default function DeletePdf() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  return (
    <>
      <DeletePdfToggleButton handleClick={() => setDialogOpen(true)} />
      <DeletePdfDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
    </>
  );
}
