import { Autocomplete, ListItem, ListItemText, TextField } from "@mui/material";
import React, { useEffect } from "react";
import {
  GroupedOptions,
  fetchClassViaNeuralEngine,
  fetchExternalClasses,
} from "../../../../../utils/fetchClass";
import { useStore } from "store/store";
import { v4 as uuid } from "uuid";
import { RDFResource } from "../../../../../types/triple";
import { getTripleClass } from "../../../utils/getTripleLabelAndClass";

export default function EditSubjectClass({
  accessKey,
  triple,
  setClass,
}: {
  accessKey: string;
  triple?: RDFResource;
  setClass?: (label?: string, newClass?: string) => void;
}) {
  const {
    ontologyUrls,
    prefixes,
    rdfResources,
    setRDFResources,
    setSelectedRDFResource,
  } = useStore();
  const className = getTripleClass("subject", rdfResources, triple);

  const [value, setValue] = React.useState<GroupedOptions | null>({
    class: className,
    score: 0,
    group: "",
    fullClass: "",
  });
  const [inputValue, setInputValue] = React.useState(className);
  const [options, setOptions] = React.useState<GroupedOptions[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const neuralOption = await fetchClassViaNeuralEngine(
        inputValue,
        ontologyUrls as string[],
      );

      const externalOptions = await fetchExternalClasses(
        inputValue,
        prefixes.map((p) => p.prefix),
      );
      setOptions([...externalOptions, ...neuralOption]);
      setLoading(false);
    };
    try {
      fetch();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [inputValue, accessKey]);

  const updateClass = async (groupedVal: GroupedOptions | null) => {  
    setInputValue(groupedVal?.class ?? "");
    setValue(groupedVal);
    if (setClass) {
      setClass(undefined, groupedVal?.fullClass ?? "");
      return;
    }
    if (!groupedVal || !triple) return;

    const newTriple = structuredClone(triple) as RDFResource;
    newTriple["@type"] = [groupedVal.fullClass ?? ""];

    // replace the triple with the updated triple
    const newTriples = rdfResources.map((r) => {
      if (r?.id === triple?.id) return newTriple;
      return r;
    });
    setRDFResources(newTriples);
    setSelectedRDFResource(newTriple);
  };

  return (
    <Autocomplete
      title={`Subject Class`}
      placeholder="Select a class"
      value={value}
      inputValue={inputValue}
      loading={loading}
      groupBy={(option) => option.group}
      onChange={(_, newValue) => {
        updateClass(newValue);
      }}
      onInputChange={(_, newInputValue, reason) => {
        if (reason === "input") {
          setInputValue(newInputValue);
        }
      }}
      getOptionLabel={(option) => option.class}
      filterOptions={(x) => x}
      renderOption={(props, option) => (
        <ListItem
          dense
          {...props}
          key={uuid() /* fix for duplicate key error */}
        >
          <ListItemText
            style={{ padding: "0 0.1rem" }}
            primary={option.class}
            secondary={option.score === 0 ? "" : `Score: ${option.score}%`}
          />
        </ListItem>
      )}
      options={options}
      renderInput={(params) => (
        <TextField variant="outlined" label={`Subject Class`} {...params} />
      )}
    />
  );
}
