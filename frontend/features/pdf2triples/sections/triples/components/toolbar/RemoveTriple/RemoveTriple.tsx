import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import { Remove } from "@mui/icons-material";
import React from "react";
import RemoveTripleDialog from "./RemoveTripleDialog";
import { useStore } from "store/store";
import { hasSelectedTriple } from "../../../utils/checks/hasSelectedTriple";
import { hasImportedPdf } from "../../../utils/checks/hasImportedPdf";

export default function RemoveTriple() {
  const [open, setOpen] = React.useState(false);
  const { selectedRDFResource, pdf2triplesGlobalPdf: pdf } =
    useStore();

  const handleOpen = () => setOpen(true);

  const disabled = !hasSelectedTriple(selectedRDFResource) || !hasImportedPdf(pdf);

  const computeTooltipLabel = () => {
    switch (true) {
      case !hasImportedPdf(pdf):
        return "Please import a PDF to remove a triple";
      case !hasSelectedTriple(selectedRDFResource):
        return "Please select a triple to remove";
      default:
        return "Remove Triple";
    }
  };

  return (
    <>
      <ToggleButtonBase
        width="42px"
        element={<Remove />}
        value="view-orientation"
        handleButtonClick={handleOpen}
        tooltipLabel={computeTooltipLabel()}
        borderRadius="start"
        disabled={disabled}
      />
      <RemoveTripleDialog open={open} setOpen={setOpen} />
    </>
  );
}
