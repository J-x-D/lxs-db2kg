import React from "react";
import TextInputContent from "./components/TextInputContent";
import { Stack, Typography } from "@mui/material";

import PdfSource from "./components/PdfSource";
import { useStore } from "store/store";

export default function TextInputSection() {
  return (
    <Stack
      justifyContent={"space-between"}
      height={"100%"}
      maxWidth={"100%"}
      gap={2}
    >
      <TextInputContent />
      <TextInputSectionFooter />
    </Stack>
  );
}

function TextInputSectionFooter() {
  const { pdf2triplesHideTriples: hideTriples } = useStore();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      boxSizing={"border-box"}
      overflow={"hidden"}
      gap={4}
    >
      <PdfSource />
      {hideTriples ? <HideTriplesRemark /> : <></>}
    </Stack>
  );
}

function HideTriplesRemark() {
  return (
    <Typography
      variant={"body2"}
      color={"GrayText"}
      sx={{
        whiteSpace: "nowrap",
        maxWidth: "auto",
      }}
    >
      Triples are hidden. You can show them in the toolbar.
    </Typography>
  );
}
