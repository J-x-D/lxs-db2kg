"use client";
import { useStore } from "store/store";
import React, { useEffect, useState } from "react";
import { checkHasAnyTriples } from "../../../utils/checks/hasAnyTriples";
import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import { FileDownloadOutlined } from "@mui/icons-material";
import { downloadTripleFile } from "features/pdf2triples/utils/downloadTripleFile";
import { hasImportedPdf } from "../../../utils/checks/hasImportedPdf";
import { useRouter } from "next/navigation";

export default function DownloadTriples({ solo }: { solo?: boolean }) {
  const { rdfResources, pdf2triplesGlobalPdf: pdf } = useStore();
  const [_document, setDocument] = React.useState<Document | null>(null);
  const router = useRouter();

  useEffect(() => {
    setDocument(document);
  }, []);

  const disabled = !checkHasAnyTriples(rdfResources) || !hasImportedPdf(pdf);
  const [tooltipLabel, setTooltipLabel] = useState("");

  const computeTooltipLabel = () => {
    switch (true) {
      case !hasImportedPdf(pdf):
        return "Please import a PDF to download its triples";
      case !checkHasAnyTriples(rdfResources):
        return "Please add at least one triple to download";
      default:
        return "Download Triples";
    }
  };

  useEffect(() => {
    setTooltipLabel(computeTooltipLabel());
  }, [pdf, rdfResources]);

  return (
    <>
      <ToggleButtonBase
        width="42px"
        borderRadius={solo ? "" : "end"}
        element={<FileDownloadOutlined />}
        value="file-download"
        handleButtonClick={() => {
          downloadTripleFile({
            triples: rdfResources,
            fileName: "triples" + Date.now(),
            document: _document,
          });
          router.push("/finished");
        }}
        disabled={disabled}
        tooltipLabel={tooltipLabel}
      />
    </>
  );
}
