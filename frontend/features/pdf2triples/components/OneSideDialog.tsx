import { Dialog, Typography } from "@mui/material";
import type { DialogProps } from "@mui/material";
import React from "react";

function RemarkReleaseDrop() {
  return (
    <Typography
      variant="h4"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 100,
      }}
    >
      Drop it like it&apos;s hot!
    </Typography>
  );
}

export default function OneSideDialog({
  children,
  side = "right",
  isHovered,
  ...props
}: {
  children: React.ReactNode;
  side?: "left" | "right";
  isHovered?: boolean;
} & DialogProps) {
  return (
    <Dialog
      disableEnforceFocus // allow selection of text in the background
      {...props}
      sx={{
        "&.MuiDialog-root": {
          position: "absolute",
          top: "0",
          bottom: "0",
          right: "0%",
          left: "0%",
          transform: "translate(" + (side === "left" ? "0%" : "100%") + ", 0)",
          width: "50%",
        },
        "& .MuiBackdrop-root": {
          display: "none",
        },
        "& .MuiDialog-paper": {
          width: "200%",
          backgroundColor: isHovered ? "#eee" : "#fff",
          border: isHovered ? "1px dashed #aaa" : "",
        },
        "& .MuiDialogContent-root": {
          opacity: isHovered ? 0.6 : 1,
        },
      }}
    >
      {isHovered && <RemarkReleaseDrop />}
      {children}
    </Dialog>
  );
}
