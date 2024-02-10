import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import { AutoAwesomeOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useStore } from "store/store";
import { hasImportedPdf } from "../../../utils/checks/hasImportedPdf";
import styled from "@emotion/styled";
import { Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import { checkHasAnyTriples } from "../../../utils/checks/hasAnyTriples";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    borderRadius: "4px",
    fontSize: 14,
    fontWeight: 100,
  },
}));

export default function GenerateTriplesToggleButton({
  handleButtonClick,
  isDialogOpen,
}: {
  handleButtonClick: () => void;
  isDialogOpen: boolean;
}) {
  const {
    pdf2triplesGlobalPdf: pdf,
    pdf2triplesPdfEditMode,
    rdfResources,
  } = useStore();

  const [customTooltipOpen, setCustomTooltipOpen] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [tooltipLabel, setTooltipLabel] = useState<string>("");

  useEffect(() => {
    if (!hasImportedPdf(pdf)) setDisabled(true);
    else if (pdf2triplesPdfEditMode) setDisabled(true);
    else setDisabled(false);
  }, [pdf, pdf2triplesPdfEditMode]);

  const computeTooltipLabel = () => {
    switch (true) {
      case !hasImportedPdf(pdf):
        return "Please import a PDF to generate triples";
      case pdf2triplesPdfEditMode:
        return "Please disable edit mode to generate triples";
      default:
        return "Generate Triples";
    }
  };

  useEffect(() => {
    setTooltipLabel(computeTooltipLabel());
  }, [pdf]);

  const isCustomTooltipOpen = () => {
    if (isDialogOpen) return false;
    return (
      !pdf2triplesPdfEditMode &&
      hasImportedPdf(pdf) &&
      !checkHasAnyTriples(rdfResources)
    );
  };

  useEffect(() => {
    setCustomTooltipOpen(isCustomTooltipOpen());
  }, [rdfResources, pdf, pdf2triplesPdfEditMode]);

  return (
    <>
      <CustomTooltip
        title={"You can now Generate Triples!"}
        placement="bottom-start"
        arrow
        open={customTooltipOpen}
      >
        <span>
          <ToggleButtonBase
            width="42px"
            height="42px"
            value="generate-triples"
            element={
              <AutoAwesomeOutlined
                color={customTooltipOpen ? "primary" : "inherit"}
              />
            }
            handleButtonClick={handleButtonClick}
            tooltipLabel={!customTooltipOpen ? tooltipLabel : undefined}
            disabled={disabled}
          />
        </span>
      </CustomTooltip>
    </>
  );
}
