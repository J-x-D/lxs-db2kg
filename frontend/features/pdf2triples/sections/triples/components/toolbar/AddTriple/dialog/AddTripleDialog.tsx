import React, { useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogTitle,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
} from "@mui/material";
import { useStore } from "store/store";
import OneSideDialog from "../../../../../../components/OneSideDialog";
import AddSubject from "./AddSubject";
import AddObject from "./AddObject";
import AddPredicate from "./AddPredicate";
import AddKnowledge from "./AddKnowledge";
import {
  KNOWN_KEYS,
  RDFProperty,
  RDFResource,
  RDFValue,
} from "features/pdf2triples/types/triple";
import { v4 as uuidv4 } from "uuid";

const EMPTY_SUBJECT = {
  id: uuidv4(),
  "@id": "",
  "@type": [""],
  "http://www.w3.org/2000/01/rdf-schema#label": [
    {
      "@value": "",
    },
  ],
  "http://www.w3.org/2000/01/rdf-schema#comment": [
    {
      "@value": "",
    },
  ],
} as RDFResource;

const EMPTY_PREDICATE = {
  id: uuidv4(),
  "@id": "",
  "@type": ["http://www.w3.org/2002/07/owl#ObjectProperty"],
  "http://www.w3.org/2000/01/rdf-schema#label": [
    {
      "@value": "",
    },
  ],
} as RDFResource;

const EMPTY_OBJECT = {
  id: uuidv4(),
  "@id": "",
  "@type": ["http://www.w3.org/2002/07/owl#Individual"],
  "http://www.w3.org/2000/01/rdf-schema#label": [
    {
      "@value": "",
    },
  ],
} as RDFResource;

export default function AddTripleDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { rdfResources, setRDFResources, setPdf2triplesLxsTextOutlineColor } =
    useStore();

  const [activeStep, setActiveStep] = useState(0);
  const [triples, setTriples] = useState<RDFResource[]>([]);
  const [predicateTriple, setPredicateTriple] =
    useState<RDFResource>(EMPTY_PREDICATE);
  const [subjectTriple, setSubjectTriple] =
    useState<RDFResource>(EMPTY_SUBJECT);
  const [objectTriple, setObjectTriple] = useState<RDFResource>(EMPTY_OBJECT);
  const [knowledge, setKnowledge] = useState<string>();

  useEffect(() => {
    if (activeStep === 0 && open) {
      // user can select text now
      setPdf2triplesLxsTextOutlineColor("rgb(12, 33, 911)");
      return;
    }
    setPdf2triplesLxsTextOutlineColor(undefined);
  }, [activeStep, open]);

  const setSubject = (subject?: string, subjectClass?: string) => {
    let prevValue = (
      subjectTriple?.[
        "http://www.w3.org/2000/01/rdf-schema#label"
      ] as RDFValue[]
    )?.[0]?.["@value"];

    const newSubjectTriple = {
      id: uuidv4(),
      "@id": `http://example.org/${subject ?? prevValue ?? ""}`,
      "@type": [subjectClass ?? "http://www.w3.org/2002/07/owl#Individual"],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        {
          "@value": subject ?? prevValue ?? "",
        },
      ],
      "http://www.w3.org/2000/01/rdf-schema#comment": [
        {
          "@value": knowledge || "",
        },
      ],
    } as RDFResource;
    setSubjectTriple(newSubjectTriple);
  };

  const setPredicate = (predicate?: string, property?: string) => {
    if (predicate) {
      const subjectTriple = triples.find((triple) =>
        Object.keys(triple).includes(
          "http://www.w3.org/2000/01/rdf-schema#comment",
        ),
      );
      const predicateId = `http://example.org/${predicate}`;
      const newPredicateTriple = {
        id: uuidv4(),
        "@id": predicateId,
        "@type": ["http://www.w3.org/2002/07/owl#ObjectProperty"],
        "http://www.w3.org/2000/01/rdf-schema#label": [
          {
            "@value": predicate,
          },
        ],
      };
      if (subjectTriple) {
        subjectTriple[predicateId] = [{ "@id": predicateId }] as RDFValue[];
      }
      setPredicateTriple(newPredicateTriple);
    } else if (property) {
      const subject = structuredClone(subjectTriple) as RDFResource;
      const previousPredicate = Object.keys(subject).filter(
        (key) => !KNOWN_KEYS.includes(key),
      )?.[0];
      subject[property] = subject[previousPredicate];
      delete subject[previousPredicate];
      setSubjectTriple(subject);
      setPredicateTriple(EMPTY_PREDICATE);
    }
  };

  const setObject = (object?: string, objectClass?: string) => {
    let prevLabel = (
      objectTriple?.["http://www.w3.org/2000/01/rdf-schema#label"] as RDFValue[]
    )?.[0]?.["@value"];

    const newObject = {
      id: uuidv4(),
      "@id": `http://example.org/${object ?? prevLabel ?? ""}`,
      "@type": [objectClass ?? "http://www.w3.org/2002/07/owl#Individual"],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        {
          "@value": object ?? prevLabel ?? "",
        },
      ],
    } as RDFResource;

    if (subjectTriple) {
      subjectTriple[predicateTriple?.["@id"] as string] = [
        { "@id": newObject["@id"] },
      ] as RDFValue[];
    }
    setObjectTriple(newObject);
  };

  const subjectLabel = (
    subjectTriple?.[
      "http://www.w3.org/2000/01/rdf-schema#label"
    ] as RDFProperty[]
  )?.[0]["@value"] as string;

  const predicateLabel = (
    predicateTriple?.[
      "http://www.w3.org/2000/01/rdf-schema#label"
    ] as RDFProperty[]
  )?.[0]?.["@value"] as string;

  const objectLabel = (
    objectTriple?.[
      "http://www.w3.org/2000/01/rdf-schema#label"
    ] as RDFProperty[]
  )?.[0]["@value"] as string;

  const steps = [
    {
      label: "Knowledge",
      content: <AddKnowledge setKnowledge={setKnowledge} />,
    },
    {
      label: "Subject",
      content: (
        <AddSubject
          setValue={setSubject}
          triple={subjectTriple as RDFResource}
          value={subjectLabel}
        />
      ),
    },
    {
      label: "Predicate",
      content: (
        <AddPredicate
          setValue={setPredicate}
          triple={predicateTriple as RDFResource}
          value={predicateLabel}
        />
      ),
    },
    {
      label: "Object",
      content: (
        <AddObject
          setValue={setObject}
          triple={objectTriple as RDFResource}
          value={objectLabel}
        />
      ),
    },
  ];

  const submitTriple = () => {
    const subject = structuredClone(subjectTriple) as RDFResource;
    const triplesToAdd = [subject, objectTriple];
    if (predicateTriple !== EMPTY_PREDICATE) {
      triplesToAdd.push(predicateTriple);
    } else {
      subject[predicateTriple["@id"] as string] = [
        { "@id": objectTriple["@id"] },
      ] as RDFValue[];
    }
    setRDFResources([...rdfResources, ...triplesToAdd]);

    cancelAddTriple();
  };

  const cancelAddTriple = () => {
    setActiveStep(0);
    setOpen(false);
    setTriples([]);
    setPredicateTriple(EMPTY_PREDICATE);
    setSubjectTriple(EMPTY_SUBJECT);
    setObjectTriple(EMPTY_OBJECT);
  };

  const handleClickedBackButton = () => {
    if (activeStep === 0) return cancelAddTriple();
    setActiveStep(activeStep - 1);
  };

  const handleClickedNextButton = () => {
    if (activeStep === steps.length - 1) return submitTriple();
    setActiveStep(activeStep + 1);
  };

  const computeBackButtonLabel = () => {
    if (activeStep === 0) return "Cancel";
    return "Back";
  };

  const computeNextButtonLabel = () => {
    if (activeStep === steps.length - 1) return "Add Triple";
    return "Next";
  };

  const isNextButtonDisabled = () => {
    switch (activeStep) {
      case 0:
        return !knowledge;
      case 1:
        return subjectLabel === undefined;
      case 2:
        return predicateLabel === undefined;
      case 3:
        return objectLabel === undefined;
      default:
        return false;
    }
  };

  const computeNextButtonTooltip = () => {
    if (activeStep === steps.length - 1)
      return "Add triple to the list of triples";
    if (!isNextButtonDisabled()) return "Go to next step";
    switch (activeStep) {
      case 0:
        return "Please select some text before continuing to the next step.";
      case 1:
        return "Please select a subject label.";
      case 2:
        return "Please select a predicate label.";
      case 3:
        return "Please select an object label.";
      default:
        return "";
    }
  };

  return (
    <OneSideDialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>
        <Stack direction="row" gap={2} alignItems={"center"}>
          <AddCircleOutline />
          Add a New Triple
        </Stack>
      </DialogTitle>
      <Stepper
        sx={{
          maxWidth: "100%",
          padding: "1rem",
        }}
        activeStep={activeStep}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div style={{ padding: "1rem" }}>{steps[activeStep].content}</div>
      <DialogActions
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={handleClickedBackButton}>
          {computeBackButtonLabel()}
        </Button>
        <Tooltip title={computeNextButtonTooltip()} placement="left">
          <span>
            <Button
              variant="contained"
              disabled={isNextButtonDisabled()}
              onClick={handleClickedNextButton}
            >
              {computeNextButtonLabel()}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </OneSideDialog>
  );
}
