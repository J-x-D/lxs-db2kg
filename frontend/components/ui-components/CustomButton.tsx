import { Button } from "@mui/material";
import React from "react";
import theme from "../../src/theme";

/* get children */
export default function CustomButton({
  variant,
  children,
  onClick,
}: {
  variant?: "text" | "outlined" | "contained";
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      variant={variant || "contained"}
      sx={{
        borderRadius: theme.shape.borderRadius + "px",
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
