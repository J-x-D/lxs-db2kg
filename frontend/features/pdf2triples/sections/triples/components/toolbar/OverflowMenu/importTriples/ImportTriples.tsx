import React from "react";
import ImportTriplesMenuItem from "./ImportTriplesMenuItem";

export default function ImportTriples({
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
      <ImportTriplesMenuItem handleOpen={handleOpenDialog} />
      {/* <ImportTriplesDialog open={dialogOpen} handleClose={handleCloseDialog} /> */}
    </>
  );
}
