"use client";
import { Divider, List, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import TripleBox from "./components/TripleBox";
import { useStore } from "store/store";
import TripleLayout from "./components/TripleLayout";
import EmptyState from "../../layout/EmptyState";
import { DataObject } from "@mui/icons-material";
import { checkHasAnyTriples } from "./utils/checks/hasAnyTriples";
import EditSubObject from "./components/editTriple/EditSubObject";
import TripleError from "./components/TripleError";
import checkTripleErrorState from "./components/checkTripleStatus";
import { RDFResource } from "../../types/triple";
import EditSubpage from "./components/editTriple/EditSubPage";

function EmptyStateIcon({
  color,
  width,
  height,
}: {
  color: string;
  width: string;
  height: string;
}) {
  return (
    <DataObject
      sx={{
        color,
        width,
        height,
      }}
    />
  );
}
function EmptyContent() {
  return (
    <EmptyState
      title="No Triples"
      description={
        <>
          You can add a triple by clicking on the
          <br />
          &quot;Add New Triple&quot; button in the toolbar
        </>
      }
      icon={EmptyStateIcon}
      position="right"
    />
  );
}

export default function TriplesSection() {
  const {
    rdfResources: triples,
    setPdf2triplesLxsChangeMode,
    selectedRDFResource,
  } = useStore();

  console.log(
    "%cTriplesSection.tsx line:62 triples",
    "color: white; background-color: #007acc;",
    triples,
    triples.filter((triple) =>
      Object.keys(triple).includes(
        "http://www.w3.org/2000/01/rdf-schema#comment",
      ),
    ),
  );

  const hasAnyTriples = checkHasAnyTriples(triples);
  const [editStatus, setEditStatus] = useState<
    "subject" | "object" | "predicate" | null
  >(null);

  const handleGoBack = () => {
    setEditStatus(null);
    setPdf2triplesLxsChangeMode(null);
  };

  useEffect(() => {
    setTimeout(handleGoBack, 200);
  }, [selectedRDFResource]);

  if (!hasAnyTriples) return <EmptyContent />;

  const displayTriples = (triple: RDFResource, index: number) => {
    const tripleError = checkTripleErrorState(triples, index);
    return (
      <TripleBox triple={triple} tripleError={tripleError} key={triple?.id}>
        <TripleLayout triple={triple}>
          {editStatus ? (
            <EditSubpage
              triple={triple}
              accessKey={editStatus}
              goBack={() => handleGoBack()}
            />
          ) : (
            <>
              <TripleError tripleError={tripleError} />
              <List>
                <EditSubObject
                  triple={triple}
                  accessKey="subject"
                  setEditStatus={setEditStatus}
                />
                <Divider
                  sx={{
                    marginInline: 2,
                  }}
                />
                <EditSubObject
                  triple={triple}
                  accessKey="predicate"
                  setEditStatus={setEditStatus}
                />
                <Divider
                  sx={{
                    marginInline: 2,
                  }}
                />
                <EditSubObject
                  triple={triple}
                  accessKey="object"
                  setEditStatus={setEditStatus}
                />
              </List>
            </>
          )}
        </TripleLayout>
      </TripleBox>
    );
  };

  const relevantIndicator = "http://www.w3.org/2000/01/rdf-schema#comment";
  // check if relevantIndicator is in triple

  const relevantTriples = triples.filter((triple) =>
    Object.keys(triple).includes(relevantIndicator),
  );

  const leftTriples = relevantTriples.filter(
    (triple, index) => index % 2 === 0,
  );
  const rightTriples = relevantTriples.filter(
    (triple) => !leftTriples.some((leftTriple) => leftTriple === triple),
  );

  return (
    <Stack
      display={"grid"}
      gridTemplateColumns={"1fr 1fr"}
      sx={{
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      }}
      gap={3}
      maxWidth={"100%"}
      minWidth={0}
      className="triples-section"
    >
      <Stack rowGap={3} className="left">
        {leftTriples.map(displayTriples)}
      </Stack>
      <Stack rowGap={3} className="right">
        {rightTriples.map(displayTriples)}
      </Stack>
    </Stack>
  );
}
