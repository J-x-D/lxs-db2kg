import React from "react";
import {
  TextField,
} from "@mui/material";
import theme from "../../src/theme";

export default function CustomTextField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <TextField
      id={label}
      label={label}
      variant='outlined'
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      sx={{
        "& fieldset": {
          borderRadius: theme.shape.borderRadius + "px",
        },
        borderRadius: theme.shape.borderRadius + "px",
      }}
    />
  );
}
