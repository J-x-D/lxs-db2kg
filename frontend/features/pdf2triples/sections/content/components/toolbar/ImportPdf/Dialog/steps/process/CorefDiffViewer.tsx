import DiffViewer from "components/DiffViewer";
import { Undo } from "@mui/icons-material";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import CoreferenceResolutionButton, {
  Status,
} from "./CoreferenceResolutionButton";
import getDissolvedCoreferences from "features/pdf2triples/utils/getDissolvedCoreferences";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

export default function CorefDiffViewer({
  extractedText,
  resolvedText,
  reset,
  setValue,
}: {
  extractedText: string;
  resolvedText: string;
  reset: () => void;
  setValue: (coreferencedText: string) => void;
}) {
  const [status, setStatus] = useState<Status>({
    status: "idle",
  });

  const retry = async () => {
    const { response: dissolvedText, error: dissolvedError } =
      await getDissolvedCoreferences(extractedText);
    if (dissolvedError || !dissolvedText) {
      setStatus({
        status: "error",
        error: dissolvedError ?? "Something went wrong.",
      });
      return;
    }
    setValue(dissolvedText);
    setStatus({
      status: "resolved",
      changedOriginal: true,
    });
  };

  const resetToExtractedText = () => {
    if (resolvedText === extractedText) {
      setStatus({
        status: "pending",
      });
      retry();
      return;
    }
    reset();
  };

  return (
    <Stack gap={1}>
      <GuidanceInfoAlert
        title="Achieve best possible results"
        text={
          <>
            For better results we need to perform a coreference resolution on
            your text. To find out what that means, go{" "}
            <Link
              color={"text.primary"}
              href="https://nlp.stanford.edu/projects/coref.shtml#:~:text=Coreference%20resolution%20is%20the%20task,question%20answering%2C%20and%20information%20extraction."
              target="_blank"
            >
              here
            </Link>
            . The following text shows the differences between the extracted
            text and the coreferenced text. You can use it to check the results
            of the coreference resolution.
          </>
        }
      ></GuidanceInfoAlert>
      <DiffViewer oldCode={extractedText} newCode={resolvedText} />
      <Stack direction="row" gap={1} justifyContent="space-between">
        {status.status === "error" ? (
          <Typography variant="body2" color="error">
            {status.error}
          </Typography>
        ) : status.status === "resolved" ? (
          <Typography
            variant="body2"
            sx={{
              color: "success.main",
            }}
          >
            Coreferences resolved successfully.
            {status.changedOriginal
              ? " The original text was changed."
              : " No changes were made."}
          </Typography>
        ) : (
          <CoreferenceResolutionButton
            extractedText={extractedText}
            coreferencedText={resolvedText}
            setCoreferencedText={(coreferencedText) =>
              setValue(coreferencedText)
            }
            status={status}
            setStatus={setStatus}
          />
        )}

        <Tooltip title="Reset to extracted text" placement="top">
          <span>
            <Button
              variant="text"
              startIcon={<Undo />}
              onClick={resetToExtractedText}
              disabled={resolvedText === extractedText}
              sx={{
                minWidth: "max-content",
                overflow: "hidden",
              }}
            >
              Reset Text
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
