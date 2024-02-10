import React, { ReactNode, useEffect } from "react";
import {
  Button,
  CircularProgress,
  DialogContentText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { CheckOutlined, Clear, Refresh } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { RDFResource } from "features/pdf2triples/types/triple";
// import PreviewTriples from "./PreviewTriples";

export default function Success({
  children,
  genTriples,
}: {
  children: ReactNode;
  genTriples?: RDFResource[];
}) {
  return (
    <DialogContentText
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Stack direction="row" alignItems="center" gap={2}>
        <CheckOutlined
          color="success"
          sx={{
            fontSize: "4rem",
          }}
        />
        <Stack>
          <Typography variant="h6">Generated Triples Successfully</Typography>
          <Typography>{children}</Typography>
        </Stack>
      </Stack>
      {/* <PreviewTriples genTriples={genTriples} /> */}
    </DialogContentText>
  );
}

export function SuccessActions({
  handleCancel,
  handleRetry,
  handleSubmit,
}: {
  handleCancel: () => void;
  handleRetry: () => void;
  handleSubmit: () => void;
}) {
  const countdownSeconds = 15;
  const [timer, setTimer] = React.useState(countdownSeconds);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        return prev > 0 ? prev - 0.1 : prev;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      // handleSubmit();
    }
  }, [timer]);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      width={"100%"}
    >
      <Tooltip title="Do not import Generated Triples" placement="right">
        <Button onClick={handleCancel}>
          <Clear />
          Cancel
        </Button>
      </Tooltip>
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        <Tooltip title="Retry Generating Triples" placement="left">
          <Button onClick={handleRetry}>
            <Refresh />
            Retry
          </Button>
        </Tooltip>

        <Tooltip title="Submit and Import Triples" placement="left">
          <LoadingButton autoFocus onClick={handleSubmit}>
            <Stack direction="row" gap={1} alignItems="center">
              <CircularProgress
                size={16}
                value={100 - (timer * 100) / countdownSeconds}
                variant="determinate"
              />
              Submit
            </Stack>
          </LoadingButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
