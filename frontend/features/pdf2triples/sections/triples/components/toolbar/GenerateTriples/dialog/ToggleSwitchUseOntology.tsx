import React from "react";
import { useStore } from "store/store";
import {
  FormControl,
  Switch,
  FormLabel,
  Typography,
  Alert,
  AlertTitle,
  Stack,
} from "@mui/material";
import { shouldUseOntology } from "./utils/shouldUseOntology";

export default function ToggleSwitchUseOntology({
  status,
}: {
  status: { value: string };
}) {
  const {
    ontologyUrls,
    pdf2triplesGenerateBasedOntology,
    setPdf2triplesGenerateBasedOntology,
  } = useStore();

  const toggleGenerateBasedOntology = () =>
    setPdf2triplesGenerateBasedOntology(!pdf2triplesGenerateBasedOntology);

  const noOntologyImported = ontologyUrls.length === 0;

  return (
    <Stack gap={2}>
      {noOntologyImported && (
        <Alert severity="warning">
          <AlertTitle>No ontology imported</AlertTitle>
          You have not imported any ontologies <br />
          The triples will be generated without any ontology. <br />
          Make sure to check the generated triples after the generation.
        </Alert>
      )}
      <FormControl
        fullWidth
        onClick={toggleGenerateBasedOntology}
        disabled={noOntologyImported}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <FormLabel>Use imported ontology for creating triples</FormLabel>
            <Typography variant="caption" sx={{ width: "100%" }}>
              Turning this off will generate triples based on a LLM.
              <br />
              Check afterwards if the generated triples are correct.
            </Typography>
          </div>
          <Switch
            disabled={status.value === "loading" || noOntologyImported}
            checked={shouldUseOntology({
              ontologyUrls,
              pdf2triplesGenerateBasedOntology,
            })}
            onChange={toggleGenerateBasedOntology}
          />
        </div>
      </FormControl>
    </Stack>
  );
}
