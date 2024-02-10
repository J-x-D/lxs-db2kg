"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "store/store";
import { TextField } from "@mui/material";

export default function ToggleSwitchGenerateFullTextArea() {
  const [selectedText, setSelectedText] = useState<string>("");

  const {
    setPdf2TriplesGeneratePartialText,
    pdf2triplesGenerateFullText,
    pdf2triplesLxsSelectedWords,
  } = useStore();

  useEffect(() => {
    if (selectedText && !pdf2triplesGenerateFullText) {
      setPdf2TriplesGeneratePartialText(selectedText);
    } else {
      setPdf2TriplesGeneratePartialText("");
    }
  }, [selectedText]);

  const getUserSelection = () => {
    const text = pdf2triplesLxsSelectedWords
      .map((word) => word.content)
      .join(" ");
    setSelectedText(text);
  };

  useEffect(() => {
    if (pdf2triplesLxsSelectedWords.length > 0) {
      getUserSelection();
    }
    return () => {};
  }, [pdf2triplesLxsSelectedWords]);
  return (
    <TextField
      maxRows={10}
      fullWidth
      multiline
      onChange={(e) => {
        setSelectedText(e.target.value);
      }}
      label="Text to generate triples for"
      value={selectedText}
      helperText="You can select text from the PDF on the left"
      placeholder="Select the text to fill this area"
    />
  );
}
