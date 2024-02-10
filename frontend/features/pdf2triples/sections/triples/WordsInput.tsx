import { Stack, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useStore } from "store/store";

import theme from "src/theme";

export type SubpageProps = {
  setText: (text: string) => void;
  generation?: boolean;
  initialText?: string;
};

export default function WordsInput({
  setText,
  generation,
  initialText,
}: SubpageProps) {
  const {
    pdf2triplesLxsSelectedText: selectedText,
    setPdf2triplesLxsSelectedText,
    setPdf2triplesLxsTextOutlineColor,
  } = useStore();

  const [internalText, setInternalText] = React.useState<string>(
    initialText ?? "",
  );

  useEffect(() => {
    if (!selectedText) return;
    if (selectedText?.length === 0) return;
    setInternalText(selectedText);
  }, [selectedText]);

  const computeHelperText = () => {
    if (generation) {
      if (!internalText) return "Select some text to generate triples.";
      return "This is the text for which you will generate triples. Click next to continue.";
    }
    if (!internalText) return "Select some text to add a knowledge.";
    return "This is the new text for your triple.";
  };

  useEffect(() => {
    setText(internalText);
    return () => {};
  }, [internalText]);

  useEffect(() => {
    if (generation === false) {
      setPdf2triplesLxsTextOutlineColor(undefined);
    }

    return () => {};
  }, [selectedText]);

  return (
    <Stack
      sx={{
        transition: "all 0.3s",
        outline: selectedText
          ? `2px dashed ${theme.palette.divider}`
          : `2px dashed ${theme.palette.text.disabled}`,
        borderRadius: theme.shape.borderRadius + "px",
        p: 2,
      }}
      gap={2}
    >
      <TextField
        onFocus={() => setPdf2triplesLxsTextOutlineColor("rgb(63, 81, 181)")}
        multiline
        fullWidth
        placeholder="Knowledge"
        value={internalText}
        onChange={(e) => {
          setInternalText(e.target.value);
        }}
      />
      <Typography variant="body1" color="text.secondary">
        {computeHelperText()}
      </Typography>
    </Stack>
  );
}
