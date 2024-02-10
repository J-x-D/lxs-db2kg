import { useStore } from "store/store";
import { Add } from "@mui/icons-material";
import { Box, ToggleButton, Tooltip } from "@mui/material";
import React from "react";

import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import styled from "@emotion/styled";
import { hasImportedPdf } from "features/pdf2triples/sections/triples/utils/checks/hasImportedPdf";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    borderRadius: "4px",
    fontSize: 14,
    fontWeight: 100,
  },
}));

export default function ImportPdfToggleButton({
  handleClick,
}: {
  handleClick: () => void;
}) {
  const { pdf2triplesGlobalPdf: pdf } = useStore();

  const hasPdf = hasImportedPdf(pdf);

  const computeTooltipLabel = () => {
    if (!hasPdf) return "Import a new PDF";

    return "Please remove the current text before importing new text.";
  };

  return (
    <Box
      component="div"
      sx={{
        "& .MuiTooltip-tooltip": {
          backgroundColor: "white",
          color: "black",
        },
      }}
    >
      <CustomTooltip
        open={!hasPdf}
        title={"Click here to get started!"}
        placement="right"
        arrow
      >
        <Tooltip title={computeTooltipLabel()}>
          <span>
            <ToggleButton
              disabled={hasPdf}
              onClick={handleClick}
              value={0}
              sx={{
                height: "42px",
              }}
              className="import-pdf-toggle-button"
            >
              <Box component="div" display="flex" gap="0.25rem">
                <Add />
                Import Text
              </Box>
            </ToggleButton>
          </span>
        </Tooltip>
      </CustomTooltip>
    </Box>
  );
}
