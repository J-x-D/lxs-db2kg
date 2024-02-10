import { Stack } from "@mui/material";
import React, { useState } from "react";
import StepperInputActions from "../input/Actions";
import CorefDiffViewer from "./CorefDiffViewer";
import { Add } from "@mui/icons-material";

export default function ProcessText({
  extractedText,
  handleNext,
  handlePrevious,
}: {
  extractedText: string;
  handleNext: (resolvedText: string) => void;
  handlePrevious?: () => void;
}) {
  const [resolvedText, setResolvedText] = useState<string>(extractedText);
  

  return (
    <Stack gap={2} pt={0}>
      <CorefDiffViewer
        reset={() => setResolvedText(extractedText)}
        resolvedText={resolvedText}
        extractedText={extractedText}
        setValue={setResolvedText}
      />
      <StepperInputActions
        handlePrevious={handlePrevious}
        handleNext={() => handleNext(resolvedText)}
        nextButtonLabel="Import"
        nextButtonIcon={<Add />}
      />
    </Stack>
  );
}
