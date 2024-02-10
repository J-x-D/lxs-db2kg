import { useStore } from "store/store";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  Switch,
} from "@mui/material";
import React from "react";

interface BaseToggleSwitchProps {
  state: boolean;
  setState: (value: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  icon: React.ReactNode;
  iconOn?: React.ReactNode;
}

export default function BaseToggleSwitch({
  state,
  setState,
  title,
  description,
  icon,
  iconOn,
}: BaseToggleSwitchProps) {
  const { showGuidance } = useStore();
  return (
    <FormControlLabel
      sx={{
        width: "100%",
        justifyContent: "space-between",
        marginLeft: 0,
      }}
      control={
        <Switch
          checked={state}
          onChange={(_, newState) => setState(newState)}
          color="primary"
        />
      }
      label={
        <Stack direction="row" gap={2} alignItems={"center"}>
          {iconOn ? (state ? iconOn : icon) : icon}
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
