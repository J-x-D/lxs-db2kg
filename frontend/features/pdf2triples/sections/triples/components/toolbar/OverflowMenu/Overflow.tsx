import React from "react";
import OverflowToggleButton from "./OverflowToggleButton";
import OverflowMenu from "./OverflowMenu";

export default function OverflowTripleHeader() {
  const [anchorEl, setAnchorEl] = React.useState<null | Element>(null);
  const open = Boolean(anchorEl);
  const handleClick = (button: React.MouseEvent | undefined) => {
    button?.currentTarget && setAnchorEl(button?.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <OverflowToggleButton handleClick={handleClick} />
      <OverflowMenu anchorEl={anchorEl} open={open} handleClose={handleClose} />
    </>
  );
}
