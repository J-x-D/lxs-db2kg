import {
  KNOWN_KEYS,
  RDFResource,
  RDFValue,
} from "features/pdf2triples/types/triple";
import { useStore } from "store/store";
import { TextField } from "@mui/material";
import React from "react";

import { getLabel } from "../../../utils/getTripleLabelAndClass";

export default function EditObjectLabel({
  value = "",
  triple,
  setValue,
}: {
  value?: string;
  triple?: RDFResource;
  setValue?: (value: string) => void;
}) {
  const { setRDFResources, rdfResources } = useStore();

  const label = getLabel("object", triple, rdfResources);

  const [inputValue, setInputValue] = React.useState(label || value || "");

  const handleLabelChange = async (value: string) => {
    setInputValue(value);
    if (!value) return;
    if (setValue) {
      setValue(value);
      return;
    }
    if (!triple) return;

    const predicate = Object.keys(triple).filter(
      (key) => !KNOWN_KEYS.includes(key),
    )?.[0];

    // if the predicate points to a literal
    if (Object.keys((triple[predicate] as RDFValue[])[0]).includes("@value")) {
      // update this triple's object label
      const newTriple = structuredClone(triple) as RDFResource;
      newTriple[predicate] = [
        {
          "@value": value,
        },
      ];
      // replace the triple with the updated triple
      const newTriples = rdfResources.map((r) => {
        if (r?.id === triple?.id) return newTriple;
        return r;
      });
      setRDFResources(newTriples);
      return;
    }
    const objectTripleId = (triple[predicate] as RDFValue[])?.[0]?.["@id"];

    // find triple with the same object
    const tripleToUpdate = rdfResources.find(
      (r) => r["@id"] === objectTripleId,
    );

    if (!tripleToUpdate) return;

    const newTriple = structuredClone(tripleToUpdate) as RDFResource;
    newTriple["http://www.w3.org/2000/01/rdf-schema#label"] = [
      {
        "@value": value,
      },
    ];

    // replace the triple with the updated triple
    const newTriples = rdfResources.map((r) => {
      if (r?.id === tripleToUpdate?.id) return newTriple;
      return r;
    });
    setRDFResources(newTriples);
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
    </>
  );
}
