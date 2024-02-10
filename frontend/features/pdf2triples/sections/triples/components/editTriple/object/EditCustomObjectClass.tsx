import { RDFResource } from "features/pdf2triples/types/triple";
import { TextField } from "@mui/material";
import React from "react";
import { getValueBasedOnAccessKey } from "../../../utils/getValueAndLabel";
import { useStore } from "store/store";
import { getTripleClass } from "../../../utils/getTripleLabelAndClass";

export default function EditCustomObjectClass({
  setClass,
  triple,
}: {
  triple?: RDFResource;
  setClass?: (label?: string, newClass?: string) => void;
}) {
  const { setRDFResources, rdfResources } = useStore();

  const [localValue, setLocalValue] = React.useState<string>(
    getTripleClass("object", rdfResources, triple),
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
    if (setClass) setClass(undefined, event.target.value);
    if (!triple) return;
    const id = getValueBasedOnAccessKey("object", triple);
    const index = rdfResources.findIndex((r) => r?.["@id"] === id);
    const newRDFResources = structuredClone(rdfResources);
    newRDFResources[index]["@type"] = [
      `http://example.org/${event.target.value}`,
    ];
    setRDFResources(newRDFResources);
  };
  return (
    <TextField
      value={localValue}
      onChange={handleChange}
      label="Custom Ontology"
    />
  );
}
