import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import { hasImportedPdf } from "features/pdf2triples/sections/triples/utils/checks/hasImportedPdf";
import { useStore } from "store/store";
import { DeleteOutline } from "@mui/icons-material";
import React from "react";

export default function DeletePdfToggleButton({
  handleClick,
}: {
  handleClick: () => void;
}) {
  const { pdf2triplesGlobalPdf } = useStore();

  const disabled = !hasImportedPdf(pdf2triplesGlobalPdf);

  const computeTooltipLabel = () => {
    switch (true) {
      case !hasImportedPdf(pdf2triplesGlobalPdf):
        return "To remove a pdf, you must first import one";
      default:
        return "Remove current Pdf";
    }
  };

  return (
    <ToggleButtonBase
      width="max-content"
      height="42px"
      disabled={disabled}
      element={
        <>
          <DeleteOutline color={disabled ? "disabled" : "error"} /> Remove text
        </>
      }
      value="view-orientation"
      handleButtonClick={handleClick}
      tooltipLabel={computeTooltipLabel()}
    />
  );
}
