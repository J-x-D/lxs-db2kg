"use client";

import React, { useEffect, useState } from "react";
import theme from "src/theme";
import {
  Card,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import ParticleScreen from "../particles";
import { AutoEmailSend } from "./auto-email-send";

export default function Page() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundSize: "cover",
        display: "grid",
        placeItems: "center",
        backgroundColor: theme.palette.primary.dark,
      }}
    >
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        width={"100vw"}
        height={"100vh"}
        zIndex={2}
      >
        <ContentFinishedCard />
      </Stack>
      <ParticleScreen />
    </div>
  );
}

function ContentFinishedCard() {
  const [initialized, setInitialized] = useState(false);
  const steps = ["Send Triples", "Survey"];
  const [currentStep, setCurrentStep] = useState(steps[0]);
  const handleGoNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleGoBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };
  useEffect(() => {
    setInitialized(true);
  }, []);
  if (!initialized) return <></>;
  return (
    <Card
      elevation={0}
      sx={{
        zIndex: 2,
        margin: "auto",
        padding: "1.5rem",
        width: "38rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <Stepper activeStep={steps.indexOf(currentStep)}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {
        {
          "Send Triples": <SendTriples />,
          Survey: <Survey />,
        }[currentStep]
      }
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button
          disabled={currentStep === "Send Triples"}
          onClick={handleGoBack}
        >
          Back
        </Button>
        <Button disabled={currentStep === "Survey"} onClick={handleGoNext}>
          Next
        </Button>
      </Stack>
    </Card>
  );
}

function SendTriples() {
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: "1.75rem",
        }}
      >
        Thank You! 😊
      </Typography>
      <Typography>
        First of all, <b>thank you</b> for participating in our study and so
        using the LXS application. You have successfully finished the task of
        creating a Knowledge Graph from a chosen text. We hope you enjoyed the
        process and learned something new.
      </Typography>
      <Divider />
      <AutoEmailSend />
    </>
  );
}

function Survey() {
  const surveyLink =
    "https://docs.google.com/forms/d/e/1FAIpQLSfvRpZVR5-wfVy04kiT4L_kz_FGp54na_N-RGn8wbKAyBSebg/viewform?embedded=true";
  return (
    <>
      <Typography>
        The final step is to fill out the following form. This will help us to
        improve the application and gain insights into the Knowledge Graph
        creation process.
      </Typography>
      <iframe
        style={{
          width: "100%",
          height: "100%",
          minHeight: "30rem",
          maxHeight: "100vh",
          border: "none",
        }}
        src={surveyLink}
      >
        Loading Questionnaire…
      </iframe>
    </>
  );
}
