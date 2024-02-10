import React from "react";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ImportFileButton({
  handleFileChange,
  handleRemoveFile,
  name = "Upload file",
  fileType = "*",
}: {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  name?: string;
  fileType?: string;
}) {
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUpload />}
      onClick={handleRemoveFile}
    >
      {name}
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileChange}
        accept={fileType}
        multiple={false}
      />
    </Button>
  );
}
