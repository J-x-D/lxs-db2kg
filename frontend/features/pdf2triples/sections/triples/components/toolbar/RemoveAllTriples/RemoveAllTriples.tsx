import React from "react";
import RemoveAllTriplesToggleButton from "./RemoveAllTriplesToggleButton";
import RemoveAllTriplesDialog from "./RemoveAllTriplesDialog";

export default function RemoveAllTriples() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <RemoveAllTriplesToggleButton handleButtonClick={handleOpen} />
      <RemoveAllTriplesDialog open={open} handleClose={handleClose} />
    </>
  );
}
