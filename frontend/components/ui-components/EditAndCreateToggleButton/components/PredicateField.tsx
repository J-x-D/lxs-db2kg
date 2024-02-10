import { useDebounce } from "hooks/useDebounce";
import getAutocompletePredicate, {
  AutocompletePredicate,
} from "src/utils/getAutocompletePredicate";
import getSemanticSuggestions, {
  SemanticResult,
} from "src/utils/getSemanticSuggestions";
import { prefixPredicate } from "src/utils/prefixPredicate";
import { useStore } from "store/store";
import {
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function PredicateField({
  predicateDefault,
  setNewPredicate,
  predicateHasError,
  setPredicateHasError,
}: {
  predicateDefault: string;
  setNewPredicate: React.Dispatch<string>;
  predicateHasError: boolean;
  setPredicateHasError: React.Dispatch<boolean>;
}) {
  const [predicateSearch, setPredicateSearch] = useState<string>("");
  const debouncedPredicateSearch = useDebounce(predicateSearch, 500);
  const [selectOpen, setSelectOpen] = useState(false);
  const { prefixes, ontologyUrls, rmlRules } = useStore();
  const [loading, setLoading] = useState(false);

  const [prefixArr, setPrefixArr] = useState<string[]>([]);
  useEffect(() => {
    if (prefixes) {
      const prefixArr = prefixes.map((p) => p.prefix);
      setPrefixArr(prefixArr);
    }
  }, [prefixes]);
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

  function handleSelectPredicate(option: string) {
    const formattedOption = option.startsWith("+ Add ")
      ? option.slice(4)
      : option;
    setPredicate(formattedOption);
    setNewPredicate(formattedOption);
    setSelectOpen(false);
    clearAll();
  }

  function handleCloseSelect() {
    setSelectOpen(false);
    clearAll();
  }

  return (
    <FormControl
      variant="outlined"
      size="medium"
      required
      error={predicateHasError}
    >
      <InputLabel id="form-label-predicate">Predicate</InputLabel>
      <Select
        labelId="form-label-predicate"
        disableUnderline
        label="Predicate"
        id="demo-simple-select"
        value={predicate}
        onChange={(e) => {
          setPredicate(e.target.value as string);
          setPredicateHasError(false);
        }}
        MenuProps={{ autoFocus: false }}
        onOpen={() => setSelectOpen(true)}
        onClose={() => handleCloseSelect()}
        open={selectOpen}
      >
        <MenuItem value={predicate}>{predicate}</MenuItem>
        <Divider />

        <ListSubheader>
          <TextField
            autoFocus
            size="small"
            fullWidth
            value={predicateSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlePredicateSearchChange(e.target.value)
            }
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
                onClick={() =>
                  handleSelectPredicate(`+ Add ${predicateSearch}`)
                }
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
      <FormHelperText id="predicate-helper-text">
        {predicateHasError && "Predicate is required"}
      </FormHelperText>
    </FormControl>
  );
}
