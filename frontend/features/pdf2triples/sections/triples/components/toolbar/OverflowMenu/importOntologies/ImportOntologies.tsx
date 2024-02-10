import React from "react";
import ImportOntologiesMenuItem from "./ImportOntologiesMenuItem";
import ImportOntologiesDialog from "./ImportOntologiesDialog";

export default function ImportOntologies({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => {
    setDialogOpen(false);
    handleClose();
  };

  return (
    <>
      <ImportOntologiesMenuItem handleOpen={handleOpenDialog} />
      <ImportOntologiesDialog open={dialogOpen} handleClose={handleCloseDialog} />
    </>
  );
}
