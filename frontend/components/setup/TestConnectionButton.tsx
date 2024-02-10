import React from "react";
import {
  Button,
  FormControl,
  Tooltip,
} from "@mui/material";

export default function TestConnectionButton({
  disabled = false,
  onClick,
}: {
  disabled?: boolean;
  onClick: any;
}) {
  return (
    <FormControl
      sx={{
        alignItems: "center",
        justifyContent: "center",
        minWidth: "max-content",
      }}
    >
      <Tooltip title="Check the connection to your database.">
        <span>
          <Button onClick={() => onClick()} disabled={disabled}>
           Test Connection
          </Button>
        </span>
      </Tooltip>
    </FormControl>
  );
}
