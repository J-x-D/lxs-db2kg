import React, { ReactNode } from "react";
import { DialogContentText, Stack, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { DefaultActions } from "./Default";

export default function Error({ children }: { children: ReactNode }) {
  return (
    <DialogContentText>
      <Stack direction="row" alignItems="center" gap={2}>
        <ErrorOutline
          color="error"
          sx={{
            fontSize: "4rem",
          }}
        />
        <Stack>
          <Typography variant="h6" color="error">
            Error Generating Triples
          </Typography>
          <Typography color="error">{children}</Typography>
        </Stack>
      </Stack>
    </DialogContentText>
  );
}

export function ErrorActions({
  handleClose,
  handleSubmit,
}: {
  handleClose: () => void;
  handleSubmit: () => void;
}) {
  return (
    <DefaultActions
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      status={{ value: "error" }}
    />
  );
}
