import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import { Add } from "@mui/icons-material";
import React, { useEffect } from "react";
import AddTripleDialog from "./dialog/AddTripleDialog";
import { useStore } from "store/store";
import { hasImportedPdf } from "../../../utils/checks/hasImportedPdf";

export default function AddTriple() {
  const [open, setOpen] = React.useState(false);
  const {
    pdf2triplesGlobalPdf: pdf,
    pdf2triplesPdfEditMode,
    setPdf2triplesLxsSelectedWords,
    setPdf2triplesLxsSelectedText,
    setSelectedRDFResource,
  } = useStore();

  const handleOpen = () => {
    setOpen(true);
    setPdf2triplesLxsSelectedWords([]);
    setPdf2triplesLxsSelectedText("");
    setSelectedRDFResource(undefined);
  };
  const [disabled, setDisabled] = React.useState(true);

  useEffect(() => {
    setDisabled(!hasImportedPdf(pdf) || pdf2triplesPdfEditMode);
  }, [pdf, pdf2triplesPdfEditMode]);

  const computeTooltipLabel = () => {
    switch (true) {
      case !hasImportedPdf(pdf):
        return "Please import a PDF to add a triple";
      case pdf2triplesPdfEditMode:
        return "Please disable edit mode to add a triple";
      default:
        return "Add Triple";
    }
  };

  return (
    <>
      <ToggleButtonBase
        width="42px"
        element={<Add />}
        value="view-orientation"
        handleButtonClick={handleOpen}
        tooltipLabel={computeTooltipLabel()}
        borderRadius="end"
        disabled={disabled}
      />
      <AddTripleDialog open={open} setOpen={setOpen} />
    </>
  );
}
