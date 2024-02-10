import { Stack } from "@mui/material";
import React from "react";
import Header, { HeaderSpacer } from "./Header";
import TextInputToolbar from "../sections/content/TextInputToolbar";
import TriplesToolbar from "../sections/triples/TriplesToolbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        textInputToolbar={<TextInputToolbar />}
        triplesToolbar={<TriplesToolbar />}
      />
      <HeaderSpacer />
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
          position: "relative",
        }}
        display={"grid"}
        gridTemplateColumns={"1fr auto 1fr"}
      >
        {children}
      </Stack>
    </>
  );
}
