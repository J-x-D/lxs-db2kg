import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import React, {
  Fragment,
  useEffect,
  useState,
} from "react";
import { useStore } from "store/store";
import useFetchPrefixes from "hooks/useFetchPrefixes";
import { Prefix } from "types/Prefixes";
import { formatOntologiesToPrefixes } from "src/utils/formatOntologiesToPrefixes";

export default function PrefixesAutocomplete() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Prefix[]>([]);
  const { fetchPrefixes, loadingPrefixes, prefixOptions } = useFetchPrefixes();
  const { prefixes, ontologyUrls, setPrefixes } = useStore();

  // when the autocomplete is opened, start fetch prefixes. This improves performance, because prefixes are only fetched when the dropdown is opened
  useEffect(() => {
    if (!loading) {
      return;
    }
    (async () => {
      await fetchPrefixes();
      setOptions(prefixOptions);
    })();
  }, [loading]);

  // when the loading state changes, sync it with the custom hook
  useEffect(() => {
    setLoading(loadingPrefixes); // sync loading state with custom hook
  }, [loadingPrefixes]);

  // when the dropdown is opened, start loading prefixes, when it is closed, stop loading prefixes
  useEffect(() => {
    if (!open) {
      setOptions([]); // empty options array
      setLoading(false);
    } else if (options.length === 0) {
      /* if options were emptied */ setLoading(true);
    }
  }, [open]);

  // fetch prefixes from store and set them as selected
  useEffect(() => {
    if (prefixes.length > 0) {
      setPrefixes(prefixes);
    }
  }, [prefixes]);

  return (
    <Autocomplete
      multiple
      value={prefixes}
      loading={loading}
      onChange={(_, newValue) => {
        const filteredPrefixes = newValue.filter((option) => {
          return prefixOptions.some((prefixOption) => {
            return prefixOption.prefix === option.prefix;
          });
        });

        const ontoPrefixes = formatOntologiesToPrefixes(ontologyUrls);
        setPrefixes([...ontoPrefixes, ...filteredPrefixes]);
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      filterSelectedOptions // in the dropdown, only show options that are not already selected
      options={prefixOptions.sort((a, b) => {
        // Sort alphabetically
        if (a.prefix < b.prefix) {
          return -1;
        }
        if (a.prefix > b.prefix) {
          return 1;
        }
        return 0;
      })}
      isOptionEqualToValue={(option, value) => option.prefix === value.prefix}
      getOptionLabel={(option) => option.prefix} // render the prefix property in the dropdown
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            m: 0,
          }}
          label="Prefixes"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}{" "}
                {/* show loading circle when loading on the right side */}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.prefix}
            variant="filled"
            label={option.prefix}
            disabled={ontologyUrls.includes(option.url)}
            onDelete={() => {
              const filteredPrefixes = prefixes.filter((prefix) => {
                return prefix.prefix !== option.prefix;
              });
              setPrefixes(filteredPrefixes);
            }}
          />
        ))
      }
    />
  );
}
