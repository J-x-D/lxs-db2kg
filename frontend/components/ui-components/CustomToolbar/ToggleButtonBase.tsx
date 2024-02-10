import { CircularProgress, Tooltip } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import theme from "../../../src/theme";
import React from "react";

export default function ToggleButtonBase({
  element,
  label,
  value,
  handleButtonClick,
  disabled,
  borderRadius,
  tooltipLabel,
  loading,
  width = "56px",
  height = "100%",
  progress,
}: {
  element?: JSX.Element;
  label?: string;
  value?: string | null;
  handleButtonClick?: (button: React.MouseEvent | undefined) => void;
  disabled?: boolean;
  borderRadius?: string;
  tooltipLabel?: string;
  loading?: boolean;
  width?: string;
  height?: string;
  progress?: number;
}): JSX.Element {
  const customBorderRadius =
    borderRadius === "start"
      ? theme.shape.borderRadius + "px 0 0 " + theme.shape.borderRadius + "px"
      : borderRadius === "end"
      ? "0 " +
        theme.shape.borderRadius +
        "px " +
        theme.shape.borderRadius +
        "px 0"
      : theme.shape.borderRadius + "px";

  const content = (
    <span
      style={{
        width: width,
        height: height,
        display: "inline-block",
      }}
    >
      <ToggleButton
        value="toggle"
        key={value}
        disabled={disabled || loading}
        onClick={(e) => !loading && handleButtonClick?.(e)}
        sx={{
          borderRadius: customBorderRadius,
          width: width,
          height: height,
          "&.MuiToggleButton-root": {
            borderRight: borderRadius === "start" ? 0 : undefined,
          },
        }}
      >
        {loading ? (
          <CircularProgress
            sx={{
              aspectRatio: "1",
            }}
            size={24}
            value={progress}
            variant={progress !== undefined ? "determinate" : "indeterminate"}
          />
        ) : (
          element
        )}
        {label}
      </ToggleButton>
    </span>
  );

  return tooltipLabel ? (
    <Tooltip title={tooltipLabel}>{content}</Tooltip>
  ) : (
    content
  );
}
