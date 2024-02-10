"use client";
import { Card, Link, Typography } from "@mui/material";
import ParticleScreen from "app/particles";
import React from "react";
import theme from "src/theme";

export default function Page() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.primary.dark,
      }}
    >
      <Card
        sx={{
          maxWidth: "38rem",
          padding: "1.5rem",
          zIndex: 2,
        }}
      >
        <Typography variant="h1" fontSize="2rem" gutterBottom>
          Choose one of the following databases
        </Typography>
        <Typography variant="body1" gutterBottom>
          Click one of the links below and copy the content of the page to the
          text area in our application.
        </Typography>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            listStyle: "inside",
            gap: "1rem",
          }}
        >
          <li>
            <Link href="/texts/Anthropic.txt">Anthropic</Link>
          </li>
          <li>
            <Link href="/texts/AppleVisionPro.txt">AppleVisionPro</Link>
          </li>
          <li>
            <Link href="/texts/DigitalProcurementWorkspace.txt">
              DigitalProcurementWorkspace
            </Link>
          </li>
          <li>
            <Link href="/texts/MistralAI.txt">MistralAI</Link>
          </li>
          <li>
            <Link href="/texts/TeslaCybertruck.txt">TeslaCybertruck</Link>
          </li>
        </ul>
      </Card>
      <ParticleScreen />
    </div>
  );
}
