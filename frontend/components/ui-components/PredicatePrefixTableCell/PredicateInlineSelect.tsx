import { useDebounce } from "hooks/useDebounce";
import getAutocompletePredicate, {
  AutocompletePredicate,
} from "src/utils/getAutocompletePredicate";
import getSemanticSuggestions, {
  SemanticResult,
} from "src/utils/getSemanticSuggestions";
import { prefixPredicate } from "src/utils/prefixPredicate";
import updatePredicate from "src/utils/triples/update_predicate";
import { useStore } from "store/store";
import {
  Divider,
  FormControl,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function PredicateInlineSelect({
  predicateDefault,
  column,
}: {
  predicateDefault?: string;
  column: string;
}) {
  const {
    prefixes,
    ontologyUrls,
    selectedTable,
    rmlRules,
    setAlert,
    setRmlRules,
  } = useStore();

  const [predicateSearch, setPredicateSearch] = useState<string>("");
  const debouncedPredicateSearch = useDebounce(predicateSearch, 500);

  const [selectOpen, setSelectOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [predicate, setPredicate] = useState<string>(
    prefixPredicate(predicateDefault ?? "", prefixes)
  );

  const [options, setOptions] = useState<AutocompletePredicate>({
    lov: [],
    semantic: [],
  });

  const [suggestions, setSuggestions] = useState<SemanticResult[]>([]);

  useEffect(() => {
    if (!predicate) return;
    const getSuggestions = async () => {
      const results: SemanticResult[] = await getSemanticSuggestions(
        predicate,
        prefixes
      );
      setSuggestions(results);
    };

    getSuggestions();

    return () => {};
  }, [predicate]);

  async function handlePredicateSearchChange(e: string) {
    setPredicateSearch(e);
  }

  useEffect(() => {
    if (!debouncedPredicateSearch) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    async function fetchAutocompleteResults(e: string) {
      setPredicateSearch(e);
      if (e) {
        const autoCompleteOptions: AutocompletePredicate =
          await getAutocompletePredicate(e, prefixes, ontologyUrls);
        setOptions(autoCompleteOptions);
      } else {
        setOptions({
          lov: [],
          semantic: [],
        });
      }
    }
    fetchAutocompleteResults(debouncedPredicateSearch);
  }, [debouncedPredicateSearch]);

  function clearAll() {
    setPredicateSearch("");
    setOptions({
      lov: [],
      semantic: [],
    });
  }

  async function handleUpdatePredicate(option: string) {
    // get the full url of the predicate based on the prefix
    const url = prefixes.find((p) => option.includes(p.prefix))?.url;

    // cut the prefix from the option
    const withoutPrefix = option.split(":")[1];

    // add the full url to the option
    const fullOption = url ? `${url}${withoutPrefix}` : predicate;

    console.log({
      old_predicate: predicateDefault ?? "",
      predicate: fullOption,
      rmlRule: rmlRules[selectedTable],
      backup: {
        reference: column,
        subject: "id",
      },
    });

    const response = await updatePredicate({
      old_predicate: predicateDefault ?? "",
      predicate: fullOption,
      rmlRule: rmlRules[selectedTable],
      backup: {
        reference: column,
        subject: "id",
      },
    });
    if (response.status === 200) {
      const updatedRmlRule = response.data;
      successSetNewPredicate(option, predicateDefault);
      setRmlRules(selectedTable, updatedRmlRule);
    } else {
      failedSetNewPredicate(option);
    }
  }

  function successSetNewPredicate(option: string, oldPredicate?: string) {
    const formattedOption = option.startsWith("Add ")
      ? option.slice(4)
      : option;
    setPredicate(formattedOption);
    setSelectOpen(false);
    clearAll();
    setAlert({
      type: "success",
      open: true,
      message: `Updated predicate from ${oldPredicate} to ${option}.`,
      duration: 3000,
    });
  }

  function failedSetNewPredicate(option: string) {
    console.error(
      "Failed to update predicate. Could not update optiod: ",
      option
    );
    setAlert({
      type: "error",
      open: true,
      message: "Failed to update predicate.",
    });
  }

  function handleSelectPredicate(option: string) {
    handleUpdatePredicate(option);
    console.log("updating predicate", option);
  }

  function handleCloseSelect() {
    setSelectOpen(false);
    clearAll();
  }

  return (
    <FormControl variant="standard" size="small">
      <Select
        disabled={!rmlRules[selectedTable]}
        disableUnderline
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={predicate || "none"}
        onChange={(e) => {
          setPredicate(e.target.value as string);
        }}
        MenuProps={{ autoFocus: false }}
        onOpen={() => setSelectOpen(true)}
        onClose={() => handleCloseSelect()}
        open={selectOpen}
        sx={{
          color: predicate ? "text.primary" : "text.secondary",
          fontStyle: predicate ? "normal" : "italic",
        }}
      >
        <MenuItem
          sx={{
            display: "none",
          }}
          value={"none"}
        >
          None
        </MenuItem>
        {predicate && (
          <MenuItem
            sx={{
              display: predicate ? "block" : "none",
            }}
            value={predicate}
          >
            {predicate}
          </MenuItem>
        )}
        {predicate ? <Divider /> : <Stack padding={0.5} />}

        <ListSubheader>
          <TextField
            autoFocus
            size="small"
            fullWidth
            value={predicateSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handlePredicateSearchChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Escape") {
                // Prevents autoselecting item while typing (default Select behaviour)
                e.stopPropagation();
                if (e.key === "Enter") {
                  handleSelectPredicate(predicateSearch);
                }
              }
            }}
          />
        </ListSubheader>

        {predicateSearch ? (
          <Stack>
            {options.lov.length > 0 && (
              <Stack>
                <ListSubheader sx={{ marginY: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    From LOV
                  </Typography>
                </ListSubheader>
                {options.lov.map((option) => (
                  <MenuItem
                    key={uuidv4()}
                    value={option}
                    onClick={() => handleSelectPredicate(option)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Stack>
            )}
            {options.lov.length > 0 && options.semantic.length > 0 && (
              <Divider
                sx={{
                  marginY: 1,
                  display: "flex",
                }}
              />
            )}
            {options.semantic.length > 0 && (
              <Stack>
                <ListSubheader sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Semantic closest
                  </Typography>
                </ListSubheader>
                {options.semantic.map((option) => (
                  <MenuItem
                    key={uuidv4()}
                    value={option}
                    onClick={() => handleSelectPredicate(option)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Stack>
            )}
            {options.lov.length === 0 &&
              options.semantic.length === 0 &&
              (loading ? (
                <MenuItem disabled value={""}>
                  <em>Loading...</em>
                </MenuItem>
              ) : (
                <MenuItem disabled value={""}>
                  <em>No Autocomplete Results</em>
                </MenuItem>
              ))}
            {(options.lov.length > 0 || options.semantic.length > 0) && (
              <Divider
                sx={{
                  marginY: 1,
                  display: "flex",
                }}
              />
            )}
            {predicateSearch && (
              <MenuItem
                onClick={() => handleSelectPredicate(`Add ${predicateSearch}`)}
                value={predicateSearch}
              >
                + Add {predicateSearch}
              </MenuItem>
            )}
          </Stack>
        ) : (
          <Stack>
            {suggestions.length > 0 ? (
              <Stack>
                {suggestions.map((suggestion) => (
                  <MenuItem
                    key={uuidv4()}
                    value={suggestion.prefix}
                    onClick={() => handleSelectPredicate(suggestion.prefix)}
                  >
                    {suggestion.prefix}
                  </MenuItem>
                ))}
              </Stack>
            ) : (
              <Stack>
                {
                  <MenuItem disabled value={""}>
                    <em>No suggestions</em>
                  </MenuItem>
                }
              </Stack>
            )}
          </Stack>
        )}
      </Select>
    </FormControl>
  );
}
