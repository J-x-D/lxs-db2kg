"use client";

import React from "react";
import ParticleScreen from "./particles";
import theme from "src/theme";
import Onboarding from "./onboarding";
import { Stack } from "@mui/material";

export default function Page() {
  // TODO: change links


  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundSize: "cover",
        display: "grid",
        placeItems: "center",
        backgroundColor: theme.palette.primary.dark,
      }}
    >
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        width={"100vw"}
        height={"100vh"}
      >
        <Onboarding />
      </Stack>

      <ParticleScreen />
    </div>
  );
}
