import React, { useEffect, useState } from "react";
import getDissolvedCoreferences from "features/pdf2triples/utils/getDissolvedCoreferences";
import { Check, Clear, Psychology } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";

export type Status =
  | {
      status: "idle";
    }
  | {
      status: "pending";
    }
  | {
      status: "resolved";
      changedOriginal: boolean;
    }
  | {
      status: "error";
      error: string;
    };

export default function CoreferenceResolutionButton({
  extractedText,
  coreferencedText: oldCoreferencedText,
  setCoreferencedText,
  status,
  setStatus,
}: {
  extractedText: string;
  coreferencedText: string;
  setCoreferencedText: (coreferencedText: string) => void;
  status: Status;
  setStatus: (status: Status) => void;
}) {
  const [newCoreferencedText, setNewCoreferencedText] = useState<string>("");

  useEffect(() => {
    if (newCoreferencedText !== oldCoreferencedText)
      setStatus({ status: "idle" });
  }, [newCoreferencedText, oldCoreferencedText]);

  useEffect(() => {
    runCoreferenceResolution();
  }, []);

  const runCoreferenceResolution = async () => {
    setStatus({ status: "pending" });
    const { response: dissolvedText, error: dissolvedError } =
      await getDissolvedCoreferences(extractedText);

    if (dissolvedError || !dissolvedText) {
      setStatus({ status: "error", error: dissolvedError || "Error" });
      return;
    }

    setCoreferencedText(dissolvedText);
    setNewCoreferencedText(dissolvedText);

    setStatus({
      status: "resolved",
      changedOriginal: dissolvedText !== extractedText,
    });
  };

  return (
    <Stack gap={1}>
      <LoadingButton
        sx={{
          width: "fit-content",
        }}
        onClick={() => runCoreferenceResolution()}
        loading={status.status === "pending"}
        disabled={extractedText.length === 0 || status?.status === "resolved"}
        loadingPosition="start"
        startIcon={
          status.status === "resolved" ? (
            <Check />
          ) : status.status === "error" ? (
            <Clear />
          ) : (
            <Psychology />
          )
        }
        variant="outlined"
        color={
          status.status === "resolved"
            ? "success"
            : status.status === "error"
              ? "error"
              : "primary"
        }
      >
        {status.status === "resolved"
          ? "Resolved Coreferences"
          : status.status === "error"
            ? "Error"
            : status.status === "pending"
              ? "Resolving Coreferences..."
              : "Resolve Coreferences"}
      </LoadingButton>
    </Stack>
  );
}
