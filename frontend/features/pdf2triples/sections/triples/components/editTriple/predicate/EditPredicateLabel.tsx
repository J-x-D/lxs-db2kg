import { RDFResource, RDFValue } from "features/pdf2triples/types/triple";
import { useStore } from "store/store";
import { TextField } from "@mui/material";
import React from "react";
import { getValueBasedOnAccessKey } from "../../../utils/getValueAndLabel";
import { getLabel } from "../../../utils/getTripleLabelAndClass";

export default function EditPredicateLabel({
  value = "",
  triple,
  setValue,
}: {
  value?: string;
  triple?: RDFResource;
  setValue?: (value?: string, property?: string) => void;
}) {
  const { setRDFResources, rdfResources } = useStore();

  const label = getLabel("predicate", triple, rdfResources);
  const labelFromTriple = (
    triple?.["http://www.w3.org/2000/01/rdf-schema#label"] as RDFValue[]
  )?.[0]?.["@value"];
  const [inputValue, setInputValue] = React.useState(
    value || label || labelFromTriple || "",
  );

  const handleLabelChange = (label: string) => {
    setInputValue(label);
    if (setValue) {
      setValue(label);
    }
    if (!triple) return;
    const newTriple = {
      id: triple.id,
      "@id": `http://example.org/${label}`,
      "@type": ["http://www.w3.org/2002/07/owl#ObjectProperty"],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        {
          "@value": label,
        },
      ],
    } as RDFResource;

    const id = getValueBasedOnAccessKey("predicate", triple);
    const index = rdfResources.findIndex((r) => r.id === id);
    const newRDFResources = structuredClone(rdfResources);
    newRDFResources[index] = newTriple;
    setRDFResources(newRDFResources);
  };

  return (
    <>
      <TextField
        required
        fullWidth
        label="Label"
        value={inputValue}
        onChange={(e) => handleLabelChange(e.target.value)}
      />
      {/* <Typography>
        {id} - {label}
      </Typography> */}
    </>
  );
}
