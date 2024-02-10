import React from "react";
import { Button, DialogActions } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function StepperInputActions({
  handleClose,
  handlePrevious,
  handleNext,
  isLoading,
  nextDisabled,
  nextButtonLabel = "Next",
  nextButtonIcon,
}: {
  handleClose?: () => void;
  handlePrevious?: () => void;
  handleNext: () => void;
  isLoading?: boolean;
  nextDisabled?: boolean;
  nextButtonLabel?: string;
  nextButtonIcon?: React.ReactNode;
}) {
  return (
    <DialogActions
      sx={{
        justifyContent: "space-between",
      }}
    >
      {handleClose && (
        <Button onClick={handleClose} variant="text">
          Cancel
        </Button>
      )}
      {handlePrevious && (
        <Button onClick={handlePrevious} variant="text">
          Previous
        </Button>
      )}
      <LoadingButton
        variant="contained"
        loading={isLoading}
        disabled={nextDisabled}
        onClick={handleNext}
        startIcon={nextButtonIcon}
      >
        {nextButtonLabel}
      </LoadingButton>
    </DialogActions>
  );
}
