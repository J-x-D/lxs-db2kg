import React from "react";
import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import { MoreVert } from "@mui/icons-material";
import {
  ToggleButtonGroup,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import styled from "@emotion/styled";
import { useStore } from "store/store";
import { hasImportedPdf } from "../../../utils/checks/hasImportedPdf";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    borderRadius: "4px",
    fontSize: 14,
    fontWeight: 100,
  },
}));

export default function OverflowToggleButton({
  handleClick,
}: {
  handleClick: (button: React.MouseEvent | undefined) => void;
}) {
  const { ontologyUrls, rdfResources, pdf2triplesGlobalPdf } = useStore();

  const showTooltip =
    ontologyUrls.length === 0 &&
    rdfResources?.length === 0 &&
    hasImportedPdf(pdf2triplesGlobalPdf);
  return (
    <CustomTooltip
      title={"Import ontologies to generate triples"}
      placement="bottom-end"
      arrow
      open={showTooltip}
    >
      <span>
        <ToggleButtonGroup sx={{ height: "42px" }}>
          <ToggleButtonBase
            width="42px"
            height="42px"
            element={<MoreVert />}
            value="overflow-menu"
            handleButtonClick={handleClick}
          />
        </ToggleButtonGroup>
      </span>
    </CustomTooltip>
  );
}
