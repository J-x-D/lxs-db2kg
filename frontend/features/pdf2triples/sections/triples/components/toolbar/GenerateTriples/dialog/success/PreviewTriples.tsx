// not needed for now to preview the triples after generating them

import { RDFResource } from "features/pdf2triples/types/triple";
import { ArrowDropDown, ExpandMore } from "@mui/icons-material";
import {
  Card,
  Collapse,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import React, { useState } from "react";

export default function PreviewTriples({
  genTriples,
}: {
  genTriples?: RDFResource[];
}) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Stack className="success-preview-triples" gap={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ cursor: "pointer" }}
        onClick={handleToggle}
      >
        <Typography fontWeight="bold">
          {!open
            ? "Want to preview the generated triples?"
            : "Previewing Triples"}
        </Typography>
        <ArrowDropDown
          sx={{
            transform: open ? "rotate(-180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        />
      </Stack>
      <Collapse in={open}>
        {genTriples ? (
          <GenTriplesBoxes genTriples={genTriples} />
        ) : (
          <NoTriples />
        )}
      </Collapse>
    </Stack>
  );
}

function GenTriplesBoxes({ genTriples }: { genTriples: RDFResource[] }) {
  return (
    <Grid
      gap={2}
      display={"grid"}
      boxSizing={"border-box"}
      gridTemplateColumns={"1fr 1fr"}
      width={"100%"}
    >
      {genTriples.map((triple, index) => (
        <GenTriplesBox genTriple={triple} key={index} />
      ))}
    </Grid>
  );
}

function GenTriplesBox({ genTriple }: { genTriple: RDFResource }) {

  // TODO fix this value type for each row
  return (
    <Card
      elevation={0}
      sx={{
        border: "0.1px rgba(0,0,0,0.4) solid",
        width: "100%",
      }}
    >
      <Stack direction={"column"} p={2} gap={0}>
        {/* <Row title="Subject" value={genTriple.subject.text} /> */}
        <ConnectArrow />
        {/* <Row title="Predicate" value={genTriple.predicate.text} /> */}
        <ConnectArrow />
        {/* <Row title="Object" value={genTriple.object.text} /> */}
      </Stack>
    </Card>
  );
}

function ConnectArrow() {
  //   return (
  //     <SettingsEthernet
  //       sx={{ color: "rgba(0,0,0,0.4)", m: "0 auto", transform: "rotate(90deg)" }}
  //     />
  //   );
  return (
    <ExpandMore
      sx={{
        m: "0 auto",
        color: "rgba(0,0,0,0.4)",
      }}
    />
  );
}

function Row({ title, value }: { title: string; value: string }) {
  return (
    <Tooltip title={value?.length > 26 ? value : ""}>
      <Stack
        component={"p"}
        direction={"row"}
        gap={".2rem"}
        width={"100%"}
        sx={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          flexWrap: "nowrap",
          display: "block",
          my: 0,
        }}
      >
        <b>{title + ": "}</b>
        {value}
      </Stack>
    </Tooltip>
  );
}

function NoTriples() {
  return (
    <Stack py={2}>
      <Typography color={"grey"}>
        Ups! No Triples were found to preview
      </Typography>
      <Typography variant="body2" color={"GrayText"}>
        Please try generating the rules again or
        <br /> continue without previewing your generated rules.
      </Typography>
    </Stack>
  );
}
