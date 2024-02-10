import { Box, Paper, TextField, Typography } from "@mui/material";
import React from "react";

export default function GeneralOntologySettings({
  baseIRI,
  setBaseIRI,
  name,
  setName,
}: {
  baseIRI: string;
  setBaseIRI: (baseIRI: string) => void;
  name: string;
  setName: (name: string) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2">General Meta Data</Typography>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        gap={2}
        m="1rem 0"
      >
        <TextField
          fullWidth
          label="Base IRI"
          value={baseIRI}
          onChange={(e) => setBaseIRI(e.target.value)}
        />
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
    </Paper>
  );
}
