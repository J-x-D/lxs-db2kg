import { useStore } from "store/store";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

interface BaseNumberSelectProps {
  state: number;
  setState: (value: number) => void;
  title: string;
  description: string | React.ReactNode;
  icon: React.ReactNode;
  iconOn?: React.ReactNode;

  min?: number;
  max?: number;
  step?: number;
}

export default function BaseNumberSelect({
  state,
  setState,
  title,
  description,
  icon,
  iconOn,

  min = 1,
  max = 10,
  step = 1,
}: BaseNumberSelectProps) {
  const { showGuidance } = useStore();
  return (
    <FormControlLabel
      sx={{
        width: "100%",
        justifyContent: "space-between",
        marginLeft: 0,
      }}
      control={
        <FormControl variant="outlined">
          <OutlinedInput
            size="small"
            sx={{
              width: "100%",
              maxWidth: "150px",
            }}
            value={state}
            error={(state || 0) < min || (state || 0) > max}
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onChange={(e) => setState(Number(e.target.value as string) || 1)}
            endAdornment={
              <Typography
                marginLeft={1}
                color={"grey"}
                position={"absolute"}
                right={40}
              >
                Rows
              </Typography>
            }
          />
        </FormControl>
      }
      label={
        <Stack direction="row" gap={2} alignItems={"center"}>
          {icon}
          <FormControl
            sx={{
              display: "flex",
              gap: 0,
            }}
          >
            {title}
            {showGuidance && (
              <FormHelperText
                sx={{
                  margin: 0,
                  maxWidth: "400px",
                }}
              >
                {description}
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
      }
      labelPlacement="start"
    />
  );
}
