import React, { useEffect, useState } from "react";
import { Check, Clear, DeleteForever } from "@mui/icons-material";
import {
  Alert,
  Box,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ImportFileButton from "features/pdf2triples/components/importing/ImportFileButton";
import { RDFResource } from "features/pdf2triples/types/triple";

export default function InputFileUpload({
  setCanImport,
  setTriples,
  fileParent,
  handleFileChangeParent,
}: {
  setCanImport: (valid: boolean) => void;
  setTriples: (triples: RDFResource[]) => void;
  fileParent: File | null;
  handleFileChangeParent: (selectedFile: File | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isFileValid, setIsFileValid] = useState<boolean>(false);
  const [tooltipLabel, setTooltipLabel] = useState<string>("");

  const [valuesNotInPdf, setValuesNotInPdf] = useState<boolean>(false);

  useEffect(() => {
    setCanImport(!!file && !!isFileValid);
  }, [file, isFileValid]);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (e) => {
      if (!e.target) return;
      const rawFileContent = e.target.result;
      try {
        const fileContent = JSON.parse(rawFileContent as string);
        if (fileContent) {
          // const parsedContent = lxsTriplesSchema.safeParse(fileContent);
          const parsedContent = {
            success: true,
            data: fileContent,
          };
          const isFileStructureValid = parsedContent.success;

          setTooltipLabel(
            isFileStructureValid
              ? "Your file is valid. You can import it."
              : "Doesn't follow the file structure",
          );
          if (!isFileStructureValid) throw new Error("Invalid file structure");

          setTriples(parsedContent.data);
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        setIsFileValid(false);
        setTooltipLabel("Invalid file");
      }
    };
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFile = e.target.files[0];

    setFile(selectedFile);
  };

  const mBFile = file ? (file.size / 1000000).toPrecision(2) : 0;

  const handleRemoveFile = () => {
    setFile(null);
    setIsFileValid(false);
    setTooltipLabel("");
  };

  useEffect(() => {
    setFile(fileParent);
  }, [fileParent]);

  return (
    <>
      <Collapse in={!!file && isFileValid && valuesNotInPdf}>
        <Alert severity="warning" style={{ marginBottom: "16px" }}>
          While the file structure matches the expected JSON structure, at least
          one subject, predicate or object is not present in the PDF. All these
          triples will not be added.
        </Alert>
      </Collapse>
      <ImportFileButton
        fileType="application/JSON"
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
      />
      <Collapse in={!!file}>
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box
            component="div"
            sx={{
              my: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 3,
            }}
          >
            <Tooltip
              title={
                tooltipLabel ||
                "Please upload a file with the correct structure"
              }
            >
              {isFileValid ? (
                <Check color="success" />
              ) : (
                <Clear color="error" />
              )}
            </Tooltip>
            <Typography variant="body1" color="text.secondary">
              {file ? file?.name + " (" + mBFile + " MB)" : "No file uploaded"}
            </Typography>
          </Box>
          <Tooltip title="Remove file">
            <IconButton onClick={handleRemoveFile}>
              <DeleteForever color="error" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Collapse>
    </>
  );
}
