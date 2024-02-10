import { RDFResource } from "features/pdf2triples/types/triple";
import EditPredicateProperty from "./predicate/EditPredicateProperty";
import EditPredicateLabel from "./predicate/EditPredicateLabel";
import {
  Alert,
  AlertTitle,
  Collapse,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
} from "@mui/material";
import { useStore } from "store/store";
import EditObjectLabel from "./object/EditObjectLabel";
import EditObjectClass from "./object/EditObjectClass";
import { useEffect, useState } from "react";
import EditSubjectLabel from "./subject/EditSubjectLabel";
import EditSubjectClass from "./subject/EditSubjectClass";
import EditCustomObjectClass from "./object/EditCustomObjectClass";
import EditCustomSubjectClass from "./subject/EditCustomSubjectClass";
import { getLabel } from "../../utils/getTripleLabelAndClass";

function EditSPO({
  triple,
  accessKey,
  useOntologyClass,
  setValue,
  value,
  children,
}: {
  triple?: RDFResource;
  accessKey: string;
  useOntologyClass: boolean;
  setValue?: (label?: string, newClass?: string) => void;
  value?: string;
  children?: React.ReactNode;
}) {
  if (accessKey === "predicate") {
    if (useOntologyClass)
      return (
        <>
          {children}
          <EditPredicateProperty triple={triple} addPredicate={setValue} />
        </>
      );
    return (
      <>
        {children}
        <EditPredicateLabel triple={triple} setValue={setValue} value={value} />
      </>
    );
  }

  if (accessKey === "object") {
    return (
      <Stack direction="column" gap={3}>
        <EditObjectLabel triple={triple} setValue={setValue} value={value} />
        <Stack direction="column" gap={1}>
          {children}
          {useOntologyClass ? (
            <EditObjectClass
              triple={triple}
              accessKey={accessKey}
              setClass={setValue}
            />
          ) : (
            <EditCustomObjectClass setClass={setValue} triple={triple} />
          )}
        </Stack>
      </Stack>
    );
  }

  if (accessKey === "subject") {
    return (
      <Stack direction="column" gap={3}>
        <EditSubjectLabel triple={triple} setValue={setValue} value={value} />
        <Divider />
        <Stack direction="column" gap={1}>
          {children}
          {useOntologyClass ? (
            <EditSubjectClass
              triple={triple}
              accessKey={accessKey}
              setClass={setValue}
            />
          ) : (
            <EditCustomSubjectClass setClass={setValue} triple={triple} />
          )}
        </Stack>
      </Stack>
    );
  }

  return <div />;
}

export default function EditSPOSubPage({
  triple,
  accessKey,
  setValue,
  value,
}: {
  triple?: RDFResource;
  accessKey: "subject" | "object" | "predicate";
  setValue?: (label?: string, newClass?: string) => void;
  value?: string;
}) {
  const { rdfResources, ontologyUrls, prefixes } = useStore();
  const label = getLabel(accessKey, triple, rdfResources);
  const [useOntologyClass, setUseOntologyClass] = useState<boolean>(
    label === undefined,
  );

  useEffect(() => {
    setUseOntologyClass(label === undefined);
  }, [label]);

  useEffect(() => {
    if (accessKey === "predicate" && setValue) {
      setValue(undefined, undefined);
    }

    return () => {};
  }, [useOntologyClass]);

  return (
    <>
      <EditSPO
        triple={triple}
        accessKey={accessKey}
        useOntologyClass={useOntologyClass}
        setValue={setValue}
        value={value}
      >
        <FormControlLabel
          control={
            <Switch
              disabled={ontologyUrls.length === 0 && prefixes.length === 0}
              checked={useOntologyClass}
              onChange={(e) => setUseOntologyClass(e.target.checked)}
            />
          }
          label={`Use ontology ${
            accessKey === "predicate" ? "property" : "class"
          }`}
          labelPlacement="start"
          sx={{
            justifyContent: "space-between",
            ml: 0,
          }}
        />
        <Collapse in={!useOntologyClass}>
          <Alert severity="info" sx={{ marginBottom: "1rem" }}>
            <AlertTitle>Not using ontology</AlertTitle>
            You are not using the ontology for this predicate. You are now on
            the way of editing the predicate label (and so the property itself).
          </Alert>
        </Collapse>
      </EditSPO>
    </>
  );
}
