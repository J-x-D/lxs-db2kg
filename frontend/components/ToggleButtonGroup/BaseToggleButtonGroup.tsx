import { useStore } from "store/store";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React from "react";

interface BaseToggleButtonGroupProps {
  state: string;
  setState: (value: string) => void;
  title: string;
  description: string | React.ReactNode;
  icon: React.ReactNode;
  iconOn?: React.ReactNode;
  options: {
    value: string;
    label: React.ReactNode;
  }[];
}

export default function BaseToggleButtonGroup({
  state,
  setState,
  title,
  description,
  icon,
  iconOn,
  options,
}: BaseToggleButtonGroupProps) {
  const { showGuidance } = useStore();

  function selectNextOption() {
    const currentIndex = options.findIndex((o) => o.value === state);
    const nextIndex = (currentIndex + 1) % options.length;
    setState(options[nextIndex].value);
  }

  return (
    <FormControlLabel
      sx={{
        width: "100%",
        justifyContent: "space-between",
        marginLeft: 0,
      }}
      onClick={(e) => {
        e.preventDefault();
      }}
      control={
        <ToggleButtonGroup
          size="small"
          sx={{
            alignItems: "center",
            "& .MuiToggleButton-root": {
              height: "40px",
              alignItems: "center",
            },
          }}
          exclusive
          value={state}
          onChange={(_, s) => setState(s)}
        >
          {options.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
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
