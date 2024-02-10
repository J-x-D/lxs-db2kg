"use client";
import { useStore } from "store/store";
import { PostAddOutlined } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import React, { LegacyRef, useRef } from "react";
import EmptyState from "features/pdf2triples/layout/EmptyState";
import EditMode from "./EditMode";
import { hasImportedPdf } from "../../triples/utils/checks/hasImportedPdf";
import theme from "src/theme";
import { getColor } from "src/color";
import HighlightWithinTextarea from "./HighlightWithinTextArea/HighlightWithinTextArea";
import { type Selection } from "./HighlightWithinTextArea/Selection";
import { Highlight } from "./HighlightWithinTextArea/types";
import { Editor, EditorState } from "draft-js";
import getHashedComment from "../../triples/utils/getHashedComment";

function EmptyStateIcon({
  color,
  width,
  height,
}: {
  color: string;
  width: string;
  height: string;
}) {
  return (
    <PostAddOutlined
      sx={{
        color,
        width,
        height,
      }}
    />
  );
}

function EmptyContent() {
  return (
    <EmptyState
      title="No text loaded"
      description={
        <>
          You can import a Text by clicking on the
          <br />
          &quot;Import Text&quot; button in the toolbar
        </>
      }
      icon={EmptyStateIcon}
    />
  );
}

function CustomMarker(props: any) {
  const hashAndId = JSON.parse(props.className) as {
    hash: string;
    id: string;
  };

  const { rdfResources, setSelectedRDFResource, selectedRDFResource } =
    useStore();

  const triplesIdsWithTheSameComment = rdfResources
    .filter(
      (triple) =>
        triple?.["http://www.w3.org/2000/01/rdf-schema#comment"] &&
        triple["http://www.w3.org/2000/01/rdf-schema#comment"][0]["@value"] ===
          props.matchText,
    )
    .map((triple) => triple.id);

  const id =
    (triplesIdsWithTheSameComment.find(
      (id) => id === selectedRDFResource?.id,
    ) as string) ?? hashAndId.id;

  let hash = getHashedComment(selectedRDFResource);

  const isDarker = hash === hashAndId.hash;
  const isOtherTripleSelected = hash !== null && hash !== hashAndId.hash;
  let color = getColor(hashAndId.hash, isDarker, isOtherTripleSelected);

  const handleClickedMark = () => {
    if (!!selectedRDFResource) return setSelectedRDFResource(null);

    setSelectedRDFResource(
      rdfResources.find((triple) => {
        return triple.id === id;
      }),
    );
  };

  let textColor = "black";
  let fontWeight = "normal";
  if (selectedRDFResource?.id) {
    if (selectedRDFResource?.id === id) {
      textColor = "black";
      fontWeight = "bold";
    } else {
      textColor = "gray";
      fontWeight = "normal";
    }
  }

  return (
    <mark
      id={`word-${id}`}
      style={{
        backgroundColor: color,
        zIndex: 0,
        cursor: "pointer",
        wordBreak: "break-word",
        overflow: "hidden",
        borderRadius: "0.2rem",
        padding: "0.1rem",
        marginInlineEnd: "0.5rem",
        color: textColor,
        fontWeight,
      }}
      onClick={handleClickedMark}
    >
      {props.children}
    </mark>
  );
}

export default function TextInputContent() {
  const {
    rdfResources: triples,
    pdf2triplesPdfEditMode,
    pdf2triplesGlobalPdf,
    pdf2triplesHideTriples: hideTriples,
    pdf2triplesLxsTextOutlineColor,
    selectedRDFResource,
    setPdf2triplesLxsSelectedText,
  } = useStore();
  const editorRef: LegacyRef<Editor> | undefined = useRef(null);

  const hasContent = hasImportedPdf(pdf2triplesGlobalPdf);

  if (!hasContent) {
    return <EmptyContent />;
  }

  const hasEditModeEnabled = pdf2triplesPdfEditMode; // render edit mode if edit mode is enabled
  if (hasEditModeEnabled) {
    return <EditMode />;
  }

  if (hideTriples) {
    return (
      <Typography
        sx={{
          position: "relative",
          zIndex: 1,
          wordBreak: "break-word",
          userSelect: "text",
        }}
        id="content"
      >
        {pdf2triplesGlobalPdf?.text}
      </Typography>
    );
  }
  const lighterColor = (color: string | undefined) => {
    // color format rgb(0,0,0)
    // return format rgba(0,0,0,30)
    if (!color) return;
    // remove rgb( and )
    color = color.replace("rgb(", "");
    color = color.replace(")", "");

    const colorArray = color.split(",");
    const alpha = "0.1";
    return `rgba(${colorArray[0]},${colorArray[1]},${colorArray[2]},${alpha})`;
  };

  const highlight: Highlight | undefined = [];

  triples.forEach((triple) => {
    if (
      triple?.["http://www.w3.org/2000/01/rdf-schema#comment"] &&
      triple["http://www.w3.org/2000/01/rdf-schema#comment"][0]["@value"]
    ) {
      const text = triple["http://www.w3.org/2000/01/rdf-schema#comment"][0][
        "@value"
      ] as string;
      const hash = getHashedComment(triple);
      highlight.push({
        highlight: text,
        // @ts-ignore
        component: CustomMarker,
        className: JSON.stringify({
          hash,
          id: triple.id,
        }),
      });
    }
  });

  const handleNewSelection = (
    prevEditorState: EditorState,
    selection: Selection | undefined,
  ) => {
    const selectedText = pdf2triplesGlobalPdf?.text.substring(
      selection?.start ?? 0,
      selection?.end ?? 0,
    );
    if (!selectedText) return;
    setPdf2triplesLxsSelectedText(selectedText);
  };

  return (
    <Tooltip
      title="You can now select this text."
      placement="top"
      arrow
      open={!!pdf2triplesLxsTextOutlineColor}
    >
      <Box
        component="div"
        sx={{
          transition: "all 0.5s ease",
          borderRadius: theme.shape.borderRadius + "px",
          outline: "3px solid transparent",
          outlineColor: pdf2triplesLxsTextOutlineColor,
          marginInline: "-10px",
          paddingInline: "10px",
          backgroundColor: lighterColor(pdf2triplesLxsTextOutlineColor),
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            fontFamily: "monospace",
            lineHeight: "2.5rem",
            fontSize: "0.9rem",
            caretColor: "transparent",
            color: selectedRDFResource?.id ? "gray" : "black",
          }}
          id="content"
        >
          {!!pdf2triplesLxsTextOutlineColor ? (
            <p>{pdf2triplesGlobalPdf?.text ?? ""}</p>
          ) : (
            <HighlightWithinTextarea
              highlight={highlight}
              value={pdf2triplesGlobalPdf?.text ?? ""}
              // readOnly
              onChange={handleNewSelection}
              ref={editorRef}
            />
          )}
        </div>
      </Box>
    </Tooltip>
  );
}
