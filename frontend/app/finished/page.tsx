"use client";

import React, { useEffect, useState } from "react";
import theme from "src/theme";
import {
  Card,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import ParticleScreen from "../particles";
import { AutoEmailSend } from "./auto-email-send";

export default function Page() {
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
        zIndex={2}
      >
        <ContentFinishedCard />
      </Stack>
      <ParticleScreen />
    </div>
  );
}

function ContentFinishedCard() {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    setInitialized(true);
  }, []);
  if (!initialized) return <></>;
  return (
    <Card
      elevation={0}
      sx={{
        zIndex: 2,
        margin: "auto",
        padding: "1.5rem",
        width: "38rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <SendTriples />
    </Card>
  );
}

function SendTriples() {
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: "1.75rem",
        }}
      >
        Success! 🎉
      </Typography>
      <Typography>
        You have successfully created a Knowledge Graph. Your triples are ready to be sent.
      </Typography>
      <Divider />
      <AutoEmailSend />
    </>
  );
}
