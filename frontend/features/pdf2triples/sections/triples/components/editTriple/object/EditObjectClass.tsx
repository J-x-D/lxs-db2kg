import { Autocomplete, ListItem, ListItemText, TextField } from "@mui/material";
import React, { useEffect } from "react";
import {
  GroupedOptions,
  fetchClassViaNeuralEngine,
  fetchExternalClasses,
} from "../../../../../utils/fetchClass";
import { useStore } from "store/store";
import { v4 as uuid } from "uuid";
import { KNOWN_KEYS, RDFResource, RDFValue } from "../../../../../types/triple";
import { getTripleClass } from "../../../utils/getTripleLabelAndClass";

export default function EditObjectClass({
  accessKey,
  triple,
  setClass,
}: {
  accessKey: "subject" | "object" | "predicate";
  triple?: RDFResource;
  setClass?: (label?: string, newClass?: string) => void;
}) {
  const { ontologyUrls, prefixes, rdfResources, setRDFResources } = useStore();

  const className = getTripleClass(accessKey, rdfResources, triple);

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

  const updateClass = async (value: GroupedOptions | null) => {
    setInputValue(value?.class ?? "");
    setValue(value);
    if (setClass) {
      setClass(undefined, value?.fullClass ?? "");
      return;
    }
    if (!value || !triple) return;

    const predicate = Object.keys(triple).filter(
      (key) => !KNOWN_KEYS.includes(key),
    )?.[0];
    const objectTriple = (triple[predicate] as RDFValue[])?.[0]?.["@id"];

    // find triple with the same object
    const tripleToUpdate = rdfResources.find((r) => r["@id"] === objectTriple);
    if (!tripleToUpdate) return;

    const newTriple = structuredClone(tripleToUpdate) as RDFResource;
    newTriple["@type"] = [value?.fullClass ?? ""];

    // replace the triple with the updated triple
    const newTriples = rdfResources.map((r) => {
      if (r?.id === tripleToUpdate?.id) return newTriple;
      return r;
    });
    setRDFResources(newTriples);
  };

  return (
    <Autocomplete
      title={`${accessKey} Class`}
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
        <TextField variant="outlined" label={`Object Class`} {...params} />
      )}
    />
  );
}
