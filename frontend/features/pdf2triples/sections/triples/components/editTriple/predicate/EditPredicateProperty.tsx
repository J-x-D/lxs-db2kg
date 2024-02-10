import { KNOWN_KEYS, RDFResource } from "features/pdf2triples/types/triple";
import fetchPropertyViaNeuralEngine, {
  fetchExternalProperties,
} from "features/pdf2triples/utils/fetchProperty";
import { useStore } from "store/store";
import {
  Autocomplete,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  getLabelBasedOnAccessKey,
  getValueBasedOnAccessKey,
} from "../../../utils/getValueAndLabel";

export type GroupedPredicateOptions = {
  predicate: string;
  score: number;
  group: string;
};

export default function EditPredicateProperty({
  triple,
  addPredicate,
}: {
  triple?: RDFResource;
  addPredicate?: (value?: string, property?: string) => void;
}) {
  const { ontologyUrls, prefixes, rdfResources, setRDFResources } = useStore();
  const p = getValueBasedOnAccessKey("predicate", triple);
  const label = getLabelBasedOnAccessKey(p, rdfResources);
  const [value, setValue] = React.useState<GroupedPredicateOptions | null>({
    predicate: label ?? p,
    score: 0,
    group: "",
  });
  const [inputValue, setInputValue] = React.useState(label ?? p);
  const [options, setOptions] = React.useState<GroupedPredicateOptions[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetch = async () => {
      setOptions([]);
      setLoading(true);
      const neuralOptions = await fetchPropertyViaNeuralEngine(
        inputValue,
        ontologyUrls as string[],
      );

      const externalOptions = await fetchExternalProperties(
        inputValue,
        prefixes.map((p) => p.prefix),
      );
      setOptions([...externalOptions, ...neuralOptions]);
      setLoading(false);
    };
    try {
      fetch();
    } catch (error) {
      setLoading(false);
    }
  }, [inputValue]);

  const updateClass = async (value: GroupedPredicateOptions | null) => {
    setValue(value);
    if (addPredicate) addPredicate(undefined, value?.predicate ?? "");

    if (!value) return;

    // update triple's predicate
    const updatedTriple = structuredClone(triple) as RDFResource;
    const keys = Object.keys(updatedTriple);
    const predicate = keys.filter((key) => !KNOWN_KEYS.includes(key))?.[0];
    // exchange keys but keep the values
    updatedTriple[value?.predicate] = updatedTriple[predicate];
    delete updatedTriple[predicate];
    // set the new triple
    const newTriples = rdfResources.map((r) => {
      if (r?.id === triple?.id) return updatedTriple;
      return r;
    });
    setRDFResources(newTriples);
  };

  return (
    <Autocomplete
      title={"Predicate"}
      placeholder="Select a class"
      value={value}
      inputValue={inputValue}
      loading={loading}
      groupBy={(option) => option.group}
      onChange={(_, newValue) => {
        updateClass(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => option.predicate}
      filterOptions={(x) => x}
      renderOption={(props, option) => (
        //   @ts-ignore
        <ListItemButton dense {...props}>
          <ListItemText
            style={{ padding: "0 0.1rem" }}
            primary={option.predicate}
            secondary={option.score === 0 ? "" : `Score: ${option.score}%`}
          />
        </ListItemButton>
      )}
      options={options}
      renderInput={(params) => (
        <TextField label="Predicate" variant="outlined" {...params} />
      )}
    />
  );
}
