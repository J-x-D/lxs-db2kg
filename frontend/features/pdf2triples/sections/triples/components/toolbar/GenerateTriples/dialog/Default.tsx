import { useStore } from "store/store";
import { AutoAwesome } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  DialogContentText,
  Button,
  Stack,
  Tooltip,
  Collapse,
  Alert,
  AlertTitle,
} from "@mui/material";
import React from "react";
import ToggleSwitchGenerateFullText from "./ToggleSwitchGenerateFullText";
import { isTooManyTokens } from "../../../../utils/checks/isTooManyTokens";
import ToggleSwitchUseOntology from "./ToggleSwitchUseOntology";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

function AlertErrorTooManyTokens() {
  const {
    pdf2triplesGlobalPdf,
    pdf2TriplesGeneratePartialText,
    pdf2triplesGenerateFullText,
  } = useStore();
  const tooManyTokens = isTooManyTokens({
    string: pdf2triplesGlobalPdf?.text,
    partial: {
      generateFullText: pdf2triplesGenerateFullText,
      partialText: pdf2TriplesGeneratePartialText,
    },
  });

  return (
    <Collapse in={tooManyTokens}>
      <Alert severity="error">
        <AlertTitle>Too many tokens</AlertTitle>
        The PDF content is too large to generate triples. Please shorten the
        text or use the option to generate triples for a section of the PDF.
      </Alert>
    </Collapse>
  );
}

export default function Default({
  status,
}: {
  status: { value: string };
}) {
  return (
    <DialogContentText
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
      component={"div"}
    >
      <GuidanceInfoAlert
        text={
          <>
            This Step will generate triples from the PDF content. <br />
            An <b>AI Large Language Model</b> will be used to extract the
            triples.
            <br /> This process may take a few minutes.
          </>
        }
      />
      <ToggleSwitchGenerateFullText status={status} />
      <ToggleSwitchUseOntology status={status} />
      <AlertErrorTooManyTokens />
    </DialogContentText>
  );
}

export function DefaultActions({
  handleClose,
  handleSubmit,
  status,
}: {
  handleClose: () => void;
  handleSubmit: () => void;
  status: { value: string };
}) {
  const {
    pdf2triplesGlobalPdf,
    pdf2triplesGenerateFullText,
    pdf2TriplesGeneratePartialText,
  } = useStore();

  const tooManyTokens = isTooManyTokens({
    string: pdf2triplesGlobalPdf?.text,
    partial: {
      generateFullText: pdf2triplesGenerateFullText,
      partialText: pdf2TriplesGeneratePartialText,
    },
  });

  const disabled =
    (!pdf2TriplesGeneratePartialText && !pdf2triplesGenerateFullText) ||
    tooManyTokens;

  const mainButtonLabel =
    status.value === "error" ? "Retry" : "Generate Triples";
  return (
    <>
      <Button onClick={handleClose}>Cancel</Button>
      <Stack direction="row" gap={2}>
        {/* {status.value === "loading" && (
          <Button onClick={handleClose}>Skip missing triples</Button>
        )} */}

        <Tooltip
          title={
            disabled ? (
              tooManyTokens ? (
                <>The PDF content is too large to generate triples.</>
              ) : (
                <>
                  Please select some text to generate triples or toggle <br />{" "}
                  the option to generate triples for the whole PDF
                </>
              )
            ) : (
              ""
            )
          }
          arrow
          placement="left"
        >
          <span>
            <LoadingButton
              onClick={handleSubmit}
              autoFocus
              loading={status.value === "loading"}
              variant="contained"
              startIcon={<AutoAwesome />}
              disabled={disabled && status.value === "idle"}
            >
              {mainButtonLabel}
            </LoadingButton>
          </span>
        </Tooltip>
      </Stack>
    </>
  );
}
