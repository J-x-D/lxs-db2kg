import { hasImportedPdf } from "features/pdf2triples/sections/triples/utils/checks/hasImportedPdf";
import { useStore } from "store/store";
import { DnsOutlined } from "@mui/icons-material";
import React from "react";
import BaseOverflowMenuItem from "../base/BaseOverflowMenuItem";

export default function ImportOntologiesMenuItem({
  handleOpen,
}: {
  handleOpen: () => void;
}) {
  const { pdf2triplesGlobalPdf: pdf } = useStore();

  const disabled = !hasImportedPdf(pdf);

  const computeTooltipLabel = (): string => {
    if (!hasImportedPdf(pdf)) return "Please import a PDF to import ontologies";

    return "Import Ontologies from their URLs";
  };

  return (
    <BaseOverflowMenuItem
      handleClick={handleOpen}
      tooltipLabel={computeTooltipLabel()}
      disabled={disabled}
    >
      <DnsOutlined color="primary" />
      Import Ontologies
    </BaseOverflowMenuItem>
  );
}
