import { Autocomplete, ListItem, ListItemText, TextField } from "@mui/material";
import React, { useEffect } from "react";
import {
  GroupedOptions,
  fetchClassViaNeuralEngine,
  fetchExternalClasses,
} from "../../../../utils/fetchClass";
import { useStore } from "store/store";
import { v4 as uuid } from "uuid";
import { type RDFResource } from "../../../../types/triple";
import { getValueBasedOnAccessKey } from "../../utils/getValueAndLabel";

export default function EditClass({
  accessKey,
  triple,
  setClass,
}: {
  accessKey: string;
  triple: RDFResource;
  setClass?: (value: string) => void;
}) {
  const { ontologyUrls, prefixes, rdfResources } = useStore();

  const valueBasedOnAccessKey = getValueBasedOnAccessKey(
    accessKey as "subject" | "object",
    triple,
  );
  let resource = valueBasedOnAccessKey ?? "";
  const className =
    rdfResources
      .find((r: RDFResource) => r["@id"]?.includes(resource))
      ?.["@type"]?.[0].split("#")
      .pop() ?? "";

  const [value, setValue] = React.useState<GroupedOptions | null>({
    class: className,
    score: 0,
    group: "",
    fullClass: "",
  });
  const [inputValue, setInputValue] = React.useState(className);
  const [options, setOptions] = React.useState<GroupedOptions[]>([]);
  const [externalOptions, setExternalOptions] = React.useState<
    GroupedOptions[]
  >([]);
  const [neuralOptions, setNeuralOptions] = React.useState<GroupedOptions[]>(
    [],
  );
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      fetchClassViaNeuralEngine(inputValue, ontologyUrls as string[])
        .then((response) => {
          setNeuralOptions(response);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });

      fetchExternalClasses(
        inputValue,
        prefixes.map((p) => p.prefix),
      )
        .then((response) => {
          setExternalOptions(response);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    };
    fetch();
  }, [inputValue, accessKey]);

  useEffect(() => {
    setOptions([...externalOptions, ...neuralOptions]);
  }, [externalOptions, neuralOptions]);

  const updateClass = async (value: GroupedOptions | null) => {
    setInputValue(value?.class ?? "");
    if (setClass) {
      setClass(value?.class ?? "");
      return;
    }
    const newTriple = structuredClone(triple);
    // newTriple[accessKey.toLowerCase() as "subject" | "object"].class.class =
    //   value?.class ?? "";
    // newTriple[accessKey.toLowerCase() as "subject" | "object"].class.score =
    //   value?.score ?? 0;

    // setPdf2triplesLxsTriples(
    //   pdf2triplesLxsTriples.map((t: any) =>
    //     t.id === triple.id ? newTriple : t,
    //   ),
    // );
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
        <TextField
          variant="outlined"
          label={`${accessKey} Class`}
          {...params}
        />
      )}
    />
  );
}
