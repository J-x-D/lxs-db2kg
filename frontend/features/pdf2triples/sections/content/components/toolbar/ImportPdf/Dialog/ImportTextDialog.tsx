import React, { useState } from "react";
import OneSideDialog from "features/pdf2triples/components/OneSideDialog";
import InputText from "./steps/input";
import {
  Collapse,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useStore } from "store/store";
import { ExtractedTextResponse } from "../../../../types/pdfResponse";
import ProcessText from "./steps/process/ProcessText";
import stringToWords from "../../../../utils/stringToWords";
import axios from "axios";

const StepChild = ({
  activeStep,
  step,
  children,
}: {
  activeStep: number;
  step: number;
  children: React.ReactNode;
}) => {
  return (
    <Collapse in={activeStep === step} unmountOnExit>
      {children}
    </Collapse>
  );
};

export default function ImportTextDialog({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}) {
  const handleClose = () => setDialogOpen(false);

  const {
    setPdf2triplesLxsWords,
    setPdf2triplesGlobalPdf,
    setPdf2triplesPdfSource,
    handleDeletePdf,
    topics,
  } = useStore();

  const [extractedText, setExtractedText] = useState<{
    extractedText: ExtractedTextResponse;
    source: string;
  }>({ extractedText: { text: "" }, source: "" });
  const [activeStep, setActiveStep] = useState(0);

  const handleSubmit = async (coreferencedText: string) => {
    coreferencedText = capitalizeAfterPeriod(coreferencedText);
    setExtractedText((prev) => {
      return { ...prev, extractedText: { text: coreferencedText } };
    });

    const id = await processText(coreferencedText);

    setPdf2triplesGlobalPdf({
      id,
      text: coreferencedText,
      title: "Text Input",
    }); // Store the pdf in the global state to get it back in case of error
    setPdf2triplesLxsWords(stringToWords(coreferencedText)); // Will be used to show on screen
    setPdf2triplesPdfSource(extractedText.source || "Manual Input");
    handleClose();
    setActiveStep(0);
  };

  const processText = async (text: string) => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/process_text",
      {
        text,
      },
    );
    return response.data.id;
  };

  function capitalizeAfterPeriod(inputString: string) {
    return inputString.replace(
      /(?:^|[.!?]\s+)([a-z])/g,
      function (match, letter) {
        return match.toUpperCase();
      },
    );
  }

  const handleNext = (formData: ExtractedTextResponse, source: string) => {
    setExtractedText({ extractedText: formData, source });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handlePrevious = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  return (
    <OneSideDialog open={dialogOpen} side="left" onClose={handleClose}>
      <DialogTitle>Import Text</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Stepper activeStep={activeStep}>
          <Step key="input">
            <StepLabel>Import Text</StepLabel>
          </Step>
          <Step key="coref">
            <StepLabel>Solve Coreferences</StepLabel>
          </Step>
        </Stepper>
        <StepChild activeStep={activeStep} step={0}>
          <InputText handleClose={handleClose} handleNext={handleNext} />
        </StepChild>
        <StepChild activeStep={activeStep} step={1}>
          <ProcessText
            extractedText={extractedText.extractedText.text}
            handleNext={(coreferencedText) => {
              handleSubmit(coreferencedText);
            }}
            handlePrevious={handlePrevious}
          />
        </StepChild>
      </DialogContent>
    </OneSideDialog>
  );
}
