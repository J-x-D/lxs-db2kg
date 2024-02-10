import { RDFResource } from "features/pdf2triples/types/triple";
import { useStore } from "store/store";
import { TextField } from "@mui/material";
import React from "react";
import { getTripleClass } from "../../../utils/getTripleLabelAndClass";

export default function EditCustomSubjectClass({
  setClass,
  triple,
}: {
  triple?: RDFResource;
  setClass?: (label?: string, newClass?: string) => void;
}) {
  const { setRDFResources, rdfResources } = useStore();
  const [localValue, setLocalValue] = React.useState<string>(
    getTripleClass("subject", rdfResources, triple),
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
    if (setClass) setClass(undefined, event.target.value);

    if (!triple) return;
    const newTriple = structuredClone(triple) as RDFResource;
    newTriple["@type"] = [`http://example.org/${event.target.value}`];

    const newTriples = structuredClone(rdfResources).map((r) => {
      if (r.id === newTriple.id) return newTriple;
      return r;
    });
    setRDFResources(newTriples);
  };

  return (
    <TextField
      label="Custom Subject Class"
      value={localValue}
      onChange={handleChange}
    />
  );
}
