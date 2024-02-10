import { RDFResource } from "features/pdf2triples/types/triple";
import { useStore } from "store/store";
import { TextField } from "@mui/material";
import React from "react";
import {
  getLabelBasedOnAccessKey,
  getValueBasedOnAccessKey,
} from "../../../utils/getValueAndLabel";

export default function EditSubjectLabel({
  value = "",
  triple,
  setValue,
}: {
  triple?: RDFResource;
  value?: string;
  setValue?: (value: string) => void;
}) {
  const { setRDFResources, rdfResources } = useStore();

  const id = getValueBasedOnAccessKey("subject", triple);
  const label = getLabelBasedOnAccessKey(id, rdfResources);
  const [localValue, setLocalValue] = React.useState<string>(label ?? value);

  // default behavior is updating the passed triple
  const handleLabelChange = (newLabel: string, blur: boolean) => {
    setLocalValue(newLabel);
    if (setValue) {
      setValue(newLabel);
      return;
    }

    const newRDFResources = rdfResources.map((rdfResource) => {
      if (rdfResource["@id"] === triple?.["@id"]) {
        const newRDFResource = {
          ...rdfResource,
          "http://www.w3.org/2000/01/rdf-schema#label": [
            {
              "@value": newLabel,
            },
          ],
        };
        if (blur)
          return {
            ...newRDFResource,
            "@id": `http://example.org/${newLabel}`,
          };
        return newRDFResource;
      }
      return rdfResource;
    });
    setRDFResources(newRDFResources);
  };

  return (
    <>
      <TextField
        required
        fullWidth
        label="Label"
        value={localValue}
        onChange={(e) => handleLabelChange(e.target.value, false)}
        onBlur={(e) => handleLabelChange(e.target.value, true)}
      />
      {/* <Typography>
        {id} - {label}
      </Typography> */}
    </>
  );
}
