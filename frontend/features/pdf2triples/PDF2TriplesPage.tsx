"use client";
import React from "react";
import MainLayout from "./layout/MainLayout";
import FullBox from "./layout/FullBox";
import { Divider } from "@mui/material";
import dynamic from "next/dynamic";
import TriplesSection from "./sections/triples/TriplesSection";
import TextInputSection from "./sections/content/TextInputSection";
import SelectionWrapper from "./sections/triples/components/SelectionWrapper";

// NOTE: This is the main page for the PDF2Triples feature
// For testing purposes, the following link can be used to import a PDF:
// https://warnell.uga.edu/sites/default/files/inline-files/ieVeg.pdf

// Although not tested, any other PDF should work as well

const ConnectElements = dynamic(() => import("./components/ConnectElements"), {
  ssr: false,
});

export default function PDF2TriplesPage() {
  return (
    <SelectionWrapper>
      <MainLayout>
        <FullBox background="background.paper">
          <TextInputSection />
        </FullBox>
        <Divider orientation={"vertical"} />
        <FullBox>
          <TriplesSection />
        </FullBox>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <ConnectElements />
        </div>
      </MainLayout>
    </SelectionWrapper>
  );
}
