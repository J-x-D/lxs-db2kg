import React, { useState } from "react";
import { useStore } from "store/store";
import { Button, Stack, TextField, Typography } from "@mui/material";
import stringToWords from "../utils/stringToWords";

function Actions({
  position,
  newText,
  showActionButton = true,
}: {
  position?: "top" | "bottom";
  newText: string;
  showActionButton?: boolean;
}) {
  const {
    setPdf2triplesPdfEditMode,
    setPdf2triplesGlobalPdf,
    pdf2triplesGlobalPdf,
    setPdf2triplesPdfWasEdited,
    setPdf2triplesLxsWords,
  } = useStore();

  const disableEditMode = () => setPdf2triplesPdfEditMode(false);

  const handleSave = () => {
    setPdf2triplesGlobalPdf({
      ...pdf2triplesGlobalPdf,
      text: newText,
    });
    setPdf2triplesLxsWords(stringToWords(newText));
    if (pdf2triplesGlobalPdf?.text !== newText)
      setPdf2triplesPdfWasEdited(true);
    disableEditMode();
  };

  return (
    <Stack
      direction="row"
      gap={2}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      {position === "top" ? (
        <Stack>
          <Typography variant="h6">Edit Mode</Typography>
          <Typography variant="body2" color="GrayText">
            In this mode you can edit the extracted text. <br />
            This is useful if the extracted text is not accurate.
          </Typography>
        </Stack>
      ) : (
        <span></span>
      )}
      {showActionButton ? (
        <Stack
          direction="row"
          gap={2}
          alignItems={"center"}
          justifyContent={"flex-end"}
        >
          <Button variant="outlined" onClick={disableEditMode}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      ) : (
        <span></span>
      )}
    </Stack>
  );
}

export default function EditMode() {
  const { pdf2triplesGlobalPdf } = useStore();
  const [value, setValue] = useState<string>(pdf2triplesGlobalPdf?.text || "");
  return (
    <Stack gap={2}>
      <Actions position="top" newText={value} />
      <TextField
        onChange={(e) => setValue(e.target.value)}
        defaultValue={pdf2triplesGlobalPdf?.text}
        fullWidth
        id="outlined-multiline-static"
        multiline
        variant="outlined"
      />
      <Actions position="bottom" newText={value} />
    </Stack>
  );
}
