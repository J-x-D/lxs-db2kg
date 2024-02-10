import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import { useStore } from "store/store";
import { DeleteOutline } from "@mui/icons-material";
import React from "react";
import { checkHasAnyTriples } from "../../../utils/checks/hasAnyTriples";
import { hasImportedPdf } from "../../../utils/checks/hasImportedPdf";

export default function RemoveAllTriplesToggleButton({
  handleButtonClick,
}: {
  handleButtonClick: () => void;
}) {
  const { rdfResources, pdf2triplesGlobalPdf: pdf } = useStore();
  const disabled = !checkHasAnyTriples(rdfResources);

  const computeTooltipLabel = () => {
    switch (true) {
      case !hasImportedPdf(pdf):
        return "Please import a PDF to delete its triples";
      case !checkHasAnyTriples(rdfResources):
        return "No triples to delete";
      default:
        return "Delete all Triples";
    }
  };

  return (
    <ToggleButtonBase
      width="42px"
      element={<DeleteOutline color={disabled ? "disabled" : "error"} />}
      disabled={disabled}
      handleButtonClick={handleButtonClick}
      tooltipLabel={computeTooltipLabel()}
    />
  );
}
