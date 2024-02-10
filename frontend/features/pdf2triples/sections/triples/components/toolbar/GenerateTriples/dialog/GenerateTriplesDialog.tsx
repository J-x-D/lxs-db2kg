import {
  Alert,
  AlertTitle,
  Collapse,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OneSideDialog from "../../../../../../components/OneSideDialog";
import { useStore } from "store/store";
import Success, { SuccessActions } from "./success/Success";
import Loading, { LoadingActions } from "./Loading";
import Default, { DefaultActions } from "./Default";
import Error from "./Error";
import { checkHasAnyTriples } from "../../../../utils/checks/hasAnyTriples";
import { ExtractedTextResponse } from "features/pdf2triples/sections/content/types/pdfResponse";
import { handleSubmitGeneratedTriples } from "./utils/handleSubmitGeneratedTriples";
import { RDFResource } from "features/pdf2triples/types/triple";

export interface Status {
  value: "idle" | "loading" | "success" | "error";
  message?: string;
  triplesGenerated?: RDFResource[];
}

function AlreadyTriplesAlert() {
  const [open, setOpen] = React.useState<boolean>(true);
  return (
    <Collapse in={open}>
      <Alert
        severity="warning"
        onClose={() => {
          setOpen(false);
        }}
      >
        <AlertTitle>This PDF already has triples</AlertTitle>
        Generating new Triples may overwrite your existing triples.
      </Alert>
    </Collapse>
  );
}

export default function GenerateTriplesDialog({
  open,
  handleClose: onClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const {
    pdf2triplesGlobalPdf: pdf,
    rdfResources,
    pdf2TriplesGeneratePartialText,
    pdf2triplesGenerateFullText,
    setRDFResources,
    ontologyUrls,
    topics,
    prompts,
    prefixes,
    pdf2triplesGenerateBasedOntology,
    setPdf2TriplesGeneratePartialText,
    setPdf2triplesLxsTextOutlineColor,
    setPdf2triplesGenerateFullText,
  } = useStore();

  const [localTriples, setLocalTriples] = useState<RDFResource[]>([]);

  const [status, setStatus] = useState<Status>({
    value: "idle",
  });

  const [alreadyHasTriples, setAlreadyHasTriples] = useState<boolean>(false);
  useEffect(() => {
    setAlreadyHasTriples(checkHasAnyTriples(rdfResources));
  }, [rdfResources]);

  const handleClose = () => {
    onClose();
    setPdf2triplesLxsTextOutlineColor(undefined);
    setPdf2TriplesGeneratePartialText("");
    setPdf2triplesGenerateFullText(true);

    setTimeout(() => {
      setStatus({ value: "idle" });
    }, 300); // avoid flickering
  };

  const handleSubmit = () => {
    setPdf2triplesLxsTextOutlineColor(undefined);
    setPdf2TriplesGeneratePartialText("");
    handleSubmitGeneratedTriples({
      pdf,
      pdf2triplesGenerateFullText,
      pdf2TriplesGeneratePartialText,
      setLocalTriples,
      setStatus,
      ontologyUrls,
      topics,
      prompts,
      prefixes,
      pdf2triplesGenerateBasedOntology,
      rdfResources,
    });
  };

  const handleSubmitSuccess = () => {
    handleClose();
    if (!pdf2triplesGenerateFullText) {
      setRDFResources([...rdfResources, ...localTriples]);
      return;
    }
    setRDFResources(localTriples);
  };

  return (
    <OneSideDialog open={open} onClose={handleClose}>
      <DialogTitle>Generate Triples</DialogTitle>
      <DialogContent
        sx={{
          gap: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {status.value === "idle" || status.value === "loading" ? (
          <>
            {alreadyHasTriples && pdf2triplesGenerateFullText ? (
              <AlreadyTriplesAlert />
            ) : (
              <></>
            )}

            <Default status={status} />
          </>
        ) : (
          <></>
        )}
        <Collapse in={status.value !== "idle"}>
          {
            {
              idle: <></>,
              loading: (
                <Loading
                  textSent={
                    (!pdf2triplesGenerateFullText
                      ? {
                          title: pdf?.title,
                          text: pdf2TriplesGeneratePartialText,
                          error: pdf?.error,
                        }
                      : pdf) as ExtractedTextResponse
                  }
                />
              ),
              success: (
                <Success genTriples={status?.triplesGenerated}>
                  {status.message}
                </Success>
              ),
              error: <Error>{status.message}</Error>,
            }[status.value]
          }
        </Collapse>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
        }}
      >
        {
          {
            idle: (
              <DefaultActions
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                status={status}
              />
            ),
            loading: (
              <LoadingActions
                handleClose={handleClose}
                handleSubmit={handleSubmit}
              />
            ),
            success: (
              <SuccessActions
                handleCancel={handleClose}
                handleRetry={handleSubmit}
                handleSubmit={handleSubmitSuccess}
              />
            ),
            error: (
              <DefaultActions
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                status={status}
              />
            ),
          }[status.value]
        }
      </DialogActions>
    </OneSideDialog>
  );
}
