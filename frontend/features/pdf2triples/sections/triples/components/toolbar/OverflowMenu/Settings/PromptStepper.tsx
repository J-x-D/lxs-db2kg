import {
  Button,
  Stack,
  Step,
  StepButton,
  StepContent,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { Edit, Save } from "@mui/icons-material";
import Stepper from "@mui/material/Stepper";
import { useStore } from "store/store";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

export default function PromptStepper() {
  const { prompts, setPrompts } = useStore();
  const [activeStep, setActiveStep] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  const handleClick = () => {
    if (isEditing) {
      const newPrompts = structuredClone(prompts);
      newPrompts[activeStep].prompt = value;
      setPrompts(newPrompts);
    }
    setIsEditing((isEditing) => !isEditing);
  };

  useEffect(() => {
    setValue(prompts[activeStep].prompt);
    return () => {};
  }, [activeStep]);

  return (
    <Stepper orientation="vertical" nonLinear activeStep={activeStep}>
      {prompts.map((step, index) => (
        <Step key={step.label}>
          <StepButton color="inherit" onClick={() => setActiveStep(index)}>
            {step.label}
          </StepButton>
          <StepContent>
            <Stack direction="column" spacing={2}>
              <GuidanceInfoAlert text={step.description} />
              <TextField
                multiline
                fullWidth
                disabled={!isEditing}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <Button
                sx={{ float: "right", marginTop: "0.5rem" }}
                startIcon={isEditing ? <Save /> : <Edit />}
                variant="contained"
                color="primary"
                onClick={() => handleClick()}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            </Stack>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}
