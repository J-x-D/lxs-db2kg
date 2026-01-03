"use client";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  Typography,
  Link as MuiLink,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ReactPlayer from "react-player";

const VIDEO_URL = "https://youtu.be/Y3SgVePJApI";

export default function Onboarding() {
  const steps = ["Introduction", "Your task", "Get Started"];
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [isStarting, setIsStarting] = useState(false);
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

  const handleStart = () => {
    setIsStarting(true);
    router.push("/new-rml");
  };

  return (
    <Card
      elevation={0}
      style={{
        zIndex: 2,
        margin: "auto",
        padding: "1.5rem",
        maxWidth: "38rem",
        minHeight: "20rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
          0: (
            <StepContent title="Introduction" handleGoNext={handleGoNext}>
              Welcome to the LXS application. This application aims to facilitate the Knowledge Graph
              creation process for non-experts.
              <br />
              The application is still in development and therefore not all
              features are available yet. If you have any questions, suggestions
              or feedback, please do not hesitate to contact us.
            </StepContent>
          ),
          1: (
            <StepContent
              title="Your task"
              handleGoNext={handleGoNext}
              handleGoBack={handleGoBack}
            >
              Your task is to create a Knowledge Graph from one of the these{" "}
              <MuiLink target="_blank" href="/databases">
                databases
              </MuiLink>
              . The goal is that all relevant information from your choosen text
              is represented in the Knowledge Graph.
              <br />
              In order to do so, you have to use the LXS application. We will
              guide you through the process step by step while you are using the
              application. We recommend watching the{" "}
              <MuiLink href={VIDEO_URL}>video</MuiLink> tutorial, as it will
              give you a better understanding of the application. The whole
              process of creating the desired Knowledge Graph takes about 20
              minutes.
              <div
                style={{
                  marginBlock: 2,
                }}
              >
                <ReactPlayer url={VIDEO_URL} controls width="100%" />
              </div>
            </StepContent>
          ),
          2: (
            <StepContent
              title="Get Started"
              handleGoNext={handleStart}
              handleGoBack={handleGoBack}
              isLastStep
              isPrimaryButtonLoading={isStarting}
            >
              You're all set! Click the button below to start creating your Knowledge Graph.
            </StepContent>
          ),
        }[steps.indexOf(currentStep)]
      }
    </Card>
  );
}

function StepContent({
  title,
  children,
  handleGoNext,
  handleGoBack,
  isLastStep,
  isPrimaryButtonLoading,
}: {
  title: string;
  children: React.ReactNode;
  handleGoNext: () => void;
  handleGoBack?: () => void;
  isLastStep?: boolean;
  isPrimaryButtonLoading?: boolean;
}) {
  return (
    <>
      <Stack gap={1} p={1}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: "1.75rem",
          }}
        >
          {title}
        </Typography>
        <Typography variant="body1">{children}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" gap={2}>
        {handleGoBack ? (
          <Button variant="text" onClick={handleGoBack}>
            Back
          </Button>
        ) : (
          <div />
        )}
        <LoadingButton
          variant="contained"
          onClick={handleGoNext}
          loading={isPrimaryButtonLoading}
        >
          {!isLastStep ? "Next" : "🚀 Start"}
        </LoadingButton>
      </Stack>
    </>
  );
}
