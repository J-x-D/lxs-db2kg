import { Box, Stack, Typography } from "@mui/material";
import React from "react";

interface EmptyStateProps {
  title: string;
  description: string | React.ReactNode;
  icon: React.FC<any>;
  position?: "left" | "right" | null;
}

export default function EmptyState({
  title,
  description,
  icon,
  position = "left",
}: EmptyStateProps) {
  const fixedPositionSx = {
    position: "fixed",
    top: 0,
    left: position === "left" ? 0 : "50vw",
    width: "50vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const normalPositionSx = {
    position: "relative",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <Box
      component="div"
      sx={position === null ? normalPositionSx : fixedPositionSx}
    >
      <Stack>
        {icon({
          color: "text.disabled",
          width: "6rem",
          height: "6rem",
        })}
        <Typography
          sx={{
            zIndex: 1,
            position: "relative",
          }}
          color="text.disabled"
          variant="h6"
        >
          {title}
        </Typography>
        <Typography color="text.disabled" variant="caption">
          {description}
        </Typography>
      </Stack>
    </Box>
  );
}
