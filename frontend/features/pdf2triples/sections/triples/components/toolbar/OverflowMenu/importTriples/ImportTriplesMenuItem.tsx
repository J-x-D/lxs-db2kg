import { hasImportedPdf } from "features/pdf2triples/sections/triples/utils/checks/hasImportedPdf";
import { useStore } from "store/store";
import { FileUploadOutlined } from "@mui/icons-material";
import React from "react";
import BaseOverflowMenuItem from "../base/BaseOverflowMenuItem";

export default function ImportTriplesMenuItem({
  handleOpen,
}: {
  handleOpen: () => void;
}) {
  const { pdf2triplesGlobalPdf: pdf } = useStore();

  const disabled: boolean = !hasImportedPdf(pdf);

  const computeTooltipLabel = (): string => {
    if (!hasImportedPdf(pdf)) return "Please import a PDF to import triples";

    return "Import Triples from a JSON file";
  };

  return (
    <BaseOverflowMenuItem
      handleClick={handleOpen}
      tooltipLabel={computeTooltipLabel()}
      disabled={true}
      placement="left"
    >
      <FileUploadOutlined color="primary" />
      Import Triples
    </BaseOverflowMenuItem>
  );
}
