"use client";

import { useStore } from "store/store";
import { Alert, Slide, Snackbar } from "@mui/material";
import React, { useEffect } from "react";

export default function AlertSnackbar() {
  const { alert, setAlert } = useStore();

  useEffect(() => {
    if (alert.open) {
      setTimeout(() => {
        closeSnackbar();
      }, alert.duration ?? 6000);
    }
  }, [alert.open]);

  const closeSnackbar = () => setAlert({ ...alert, open: false, message: "" });

  return (
    <>
      <Snackbar
        onClose={() => closeSnackbar()}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}
        open={alert.open}
      >
        <Alert onClose={() => closeSnackbar()} severity={alert.type}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}
