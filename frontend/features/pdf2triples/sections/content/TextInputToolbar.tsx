"use client";
import ToolbarGroup from "components/ui-components/CustomToolbar/ToolbarGroup";
import React, { useEffect, useRef } from "react";
import ImportPdf from "./components/toolbar/ImportPdf/ImportPdf";
import { Stack, Tooltip, Typography } from "@mui/material";
import { useStore } from "store/store";
import DeletePdf from "./components/toolbar/DeletePdf/DeletePdf";
import Overflow from "./components/toolbar/OverflowMenu/Overflow";
import { isElementOverflowing } from "../../utils/layout/isElementOverflowing";

function LeftSection() {
  return (
    <ToolbarGroup minWidth="max-content" height="42px">
      <ImportPdf />
    </ToolbarGroup>
  );
}

function MiddleSection() {
  const { pdf2triplesGlobalPdf: pdf } = useStore();
  const titleEl = useRef<HTMLElement>(null);
  const [isTitleOverflowing, setIsTitleOverflowing] = React.useState(false);

  const title = pdf?.title;

  useEffect(() => {
    if (titleEl?.current)
      setIsTitleOverflowing(isElementOverflowing(titleEl.current));
  }, [title]);

  if (!title) return <></>;

  return (
    <Tooltip title={!isTitleOverflowing ? title : ""}>
      <Typography
        variant="h6"
        ref={titleEl}
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          margin: "0 1rem",
        }}
      >
        {title}
      </Typography>
    </Tooltip>
  );
}

function RightSection() {
  return (
    <Stack direction="row" gap={2}>
      <ToolbarGroup minWidth="max-content" height="42px">
        <DeletePdf />
      </ToolbarGroup>
      <ToolbarGroup minWidth="max-content" height="42px">
        <Overflow />
      </ToolbarGroup>
    </Stack>
  );
}

export default function TextInputToolbar() {
  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      alignItems={"center"}
      width={"100%"}
    >
      <LeftSection />
      <MiddleSection />
      <RightSection />
    </Stack>
  );
}
