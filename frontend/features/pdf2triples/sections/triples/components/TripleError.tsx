import { Alert, Box } from "@mui/material";
import React from "react";
import {
  CheckTripleErrorState,
  CheckTripleErrorType,
} from "./checkTripleStatus";

export default function TripleError({
  tripleError,
}: {
  tripleError: CheckTripleErrorState;
}) {
  const types: { [key in CheckTripleErrorType]: string } = {
    NO_PREDICATE: "Has a triple but no predicate. Please add a predicate.",
    DUPLICATE_SUBJECT: "Has a duplicate subject. Please change the subject.",
  };

  const convertErrorToTooltip = (error: CheckTripleErrorType): string => {
    return types[error];
  };

  if (!tripleError.hasError || !tripleError.errorType) return null;
  return (
    <Box
      component="div"
      sx={{
        p: 2,
        pb: 0,
      }}
    >
      <Alert severity="error">
        {convertErrorToTooltip(tripleError.errorType) ?? ""}
      </Alert>
    </Box>
  );
}
