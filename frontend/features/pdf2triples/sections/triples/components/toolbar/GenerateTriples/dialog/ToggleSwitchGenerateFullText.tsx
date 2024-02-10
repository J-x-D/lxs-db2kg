import React, { useEffect } from "react";
import { useStore } from "store/store";
import {
  FormControl,
  Switch,
  FormLabel,
  Collapse,
  Typography,
} from "@mui/material";
import WordsInput from "../../../../WordsInput";

export default function ToggleSwitchGenerateFullText({
  status,
}: {
  status: { value: string };
}) {
  const {
    pdf2triplesGenerateFullText,
    setPdf2triplesGenerateFullText,
    setPdf2triplesLxsTextOutlineColor,
    setPdf2TriplesGeneratePartialText,
  } = useStore();

  const toggleGenerateFullText = () =>
    setPdf2triplesGenerateFullText(!pdf2triplesGenerateFullText);

  const setText = (text: string) => {
    setPdf2TriplesGeneratePartialText(text);
  };

  useEffect(() => {
    if (!pdf2triplesGenerateFullText) {
      setPdf2triplesLxsTextOutlineColor("rgb(63, 81, 181)");
      return;
    }

    setPdf2triplesLxsTextOutlineColor(undefined);
    setPdf2TriplesGeneratePartialText("");

    return () => {
      setPdf2triplesLxsTextOutlineColor(undefined);
    };
  }, [pdf2triplesGenerateFullText]);

  return (
    <>
      <FormControl fullWidth onClick={toggleGenerateFullText}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <FormLabel>Generate Triples for whole PDF</FormLabel>
            <Typography variant="caption" sx={{ width: "100%" }}>
              Disable if you want to generate triples for a specific part of the
              text.
            </Typography>
          </div>
          <Switch
            disabled={status.value === "loading"}
            checked={pdf2triplesGenerateFullText}
            onChange={toggleGenerateFullText}
          />
        </div>
      </FormControl>

      <Collapse in={!pdf2triplesGenerateFullText} unmountOnExit>
        <WordsInput setText={setText} generation />
      </Collapse>
    </>
  );
}
