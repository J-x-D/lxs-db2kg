import { ContentCopy, DeleteOutline, Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import React from "react";
import useFetchOntologies from "hooks/useFetchOntologies";
import { useStore } from "store/store";
import CreateEmbeddingsButton from "components/CreateEmbeddingsButton";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { formatOntologiesToPrefixes } from "src/utils/formatOntologiesToPrefixes";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

const filter = createFilterOptions<string>();

export default function OntologiesList() {
  const router = useRouter();
  const {
    setOntologyUrls,
    ontologyUrls,
    setPrefixes,
    prefixes,
    advancedMode,
    setCreatedEmbeddings,
  } = useStore();
  const {
    fetchOntologies,
    ontologiesOptions,
    error,
    loadingOntologiesOptions,
  } = useFetchOntologies();

  /* control state of dialog */
  const [openCreateOntology, setOpenCreateOntology] = React.useState(false);
  const [_navigator, setNavigator] = React.useState<any>(null);

  React.useEffect(() => {
    setNavigator(navigator);
  }, []);

  const [optionsOntologies, setOptionsOntologies] = React.useState<string[]>(
    [],
  );
  /* list of selected ontologies */
  const [selectedOntologies, setSelectedOntologies] =
    React.useState<(string | undefined)[]>(ontologyUrls);
  /* input string for ontology */
  const [ontologyInput, setOntologyInput] = React.useState<string>("");

  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [showAlert, setShowAlert] = React.useState(false);

  function handleCreateOntology() {
    setSelectedOntologies([...selectedOntologies, ontologyInput]);
    setOpenCreateOntology(false);
    setShowAlert(true);
  }

  function handleCancelCreateOntology() {
    setOpenCreateOntology(false);
    setOntologyInput("");
  }

  function handleDeleteSelectedOntology(index: number) {
    setSelectedOntologies(selectedOntologies.filter((_, i) => i !== index));
    setShowAlert(true);
  }

  function handleSelectOntology(ontology: string) {
    if (ontology.startsWith("+ Add ")) {
      ontology = ontology.slice(6);
      const ontoPrefixes = formatOntologiesToPrefixes([ontology]);
      const newPrefixes = [...ontoPrefixes, ...prefixes];
      // remove duplicates
      const uniquePrefixes = newPrefixes.filter(
        (prefix, index, self) =>
          index === self.findIndex((p) => p.prefix === prefix.prefix),
      );
      setPrefixes(uniquePrefixes);
    }
    if (selectedOntologies.includes(ontology)) return; // prevent duplicates
    if (ontology === "") return; // prevent empty string from being added
    setSelectedOntologies([...selectedOntologies, ontology]);
    setShowAlert(true);
  }

  React.useEffect(() => {
    if (!loading) {
      return;
    }

    fetchOntologies();
    setOptionsOntologies(ontologiesOptions);
  }, [loading]);

  // when the loading state changes, sync it with the custom hook
  React.useEffect(() => {
    setLoading(loadingOntologiesOptions); // sync loading state with custom hook
  }, [loadingOntologiesOptions]);

  // when the dropdown is opened, start loading prefixes, when it is closed, stop loading prefixes
  React.useEffect(() => {
    if (!open) {
      setOptionsOntologies([]); // empty options array
      setLoading(false);
    } else {
      /* if options were emptied */
      setLoading(true);
    }
  }, [open]);

  // fetch ontologies from store and set them as selected on first render
  React.useEffect(() => {
    setSelectedOntologies(ontologyUrls as string[]);
  }, [ontologyUrls]);

  React.useEffect(() => {
    setOntologyUrls(selectedOntologies); // set options to store

    const prefixesBasedOnOntologies =
      formatOntologiesToPrefixes(selectedOntologies);

    const allPrefixes = [...prefixesBasedOnOntologies, ...prefixes];
    // remove duplicates
    const uniquePrefixes = allPrefixes.filter(
      (prefix, index, self) =>
        index === self.findIndex((t) => t.prefix === prefix.prefix),
    );
    setPrefixes(uniquePrefixes);
  }, [selectedOntologies]);

  React.useEffect(() => {
    setOptionsOntologies(ontologiesOptions);
  }, [ontologiesOptions]);

  React.useEffect(() => {
    if (!showAlert) return;
    setCreatedEmbeddings(false);
  }, [showAlert]);

  return (
    <Box
      component="div"
      sx={{ display: "flex", flexDirection: "column", gap: 0 }}
    >
      {advancedMode && (
        <>
          <Typography variant="body1">Create Custom Ontology</Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{ m: "1rem 0" }}
            onClick={() => router.push("/newOntology")}
          >
            Start
          </Button>
          <Divider sx={{ m: "2rem 0" }} />
        </>
      )}
      <GuidanceInfoAlert
        title="Select Ontologies"
        text={
          <>
            Select the ontologies you want to use for your embedding. You can
            select from a list of common ontologies or add your own custom
            ontology. <b> Please select at least one ontology. </b>
          </>
        }
      >
        <Typography variant="body1">Selected Ontologies *</Typography>
      </GuidanceInfoAlert>
      <List sx={{ width: "100%", marginBottom: 0 }}>
        <ListItem sx={{ paddingX: 0, width: "100%" }}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent={"space-between"}
            width="100%"
          >
            <Autocomplete
              id="ontology-select"
              value={ontologyInput}
              loading={loading}
              onChange={(_, newValue) => {
                setOntologyInput("");
                if (newValue === null) return;
                handleSelectOntology(newValue);
              }}
              filterSelectedOptions
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              options={optionsOntologies}
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSelectOntology(ontologyInput);
                }
              }}
              filterOptions={(options, params) => {
                /* remove all already selected ontologies */
                const filtered = filter(options, params).filter(
                  (o) => !selectedOntologies?.includes(o),
                );
                /* suggest the creation of a new ontology */
                if (params.inputValue !== "") {
                  filtered.push(`+ Add ${params.inputValue}`);
                }
                return filtered;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      </>
                    ),
                  }}
                  size="small"
                />
              )}
            />
          </Stack>
        </ListItem>
        {selectedOntologies.length > 0 ? (
          selectedOntologies?.map((ontology, index) => (
            <Stack key={uuidv4()}>
              <Divider />
              <ListItem sx={{ paddingX: 0 }}>
                <Stack
                  direction="row"
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  width="100%"
                  spacing={1}
                >
                  <IconButton
                    edge="start"
                    aria-label="copy-to-clipboard"
                    size="small"
                    onClick={() => {
                      _navigator.clipboard.writeText(ontology as string);
                    }}
                  >
                    <ContentCopy fontSize="inherit" />
                  </IconButton>
                  <ListItemText primary={ontology} />

                  <IconButton
                    edge="end"
                    aria-label="delete"
                    color="warning"
                    onClick={() => handleDeleteSelectedOntology(index)}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Stack>
              </ListItem>
            </Stack>
          ))
        ) : (
          <Typography variant="body2">No Ontologies Selected</Typography>
        )}
      </List>
      <Divider sx={{ m: "2rem 0" }} />
      <Typography variant="body1" sx={{ mb: "1rem" }}>
        Create Embeddings for URLs
      </Typography>
      <CreateEmbeddingsButton
        selectedOntologies={selectedOntologies}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />
      {/* Create Ontology Dialog */}
      <Dialog
        open={openCreateOntology}
        onClose={() => setOpenCreateOntology(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create Ontology</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Ontology URL"
            type="text"
            fullWidth
            value={ontologyInput}
          />
        </DialogContent>
        <DialogActions sx={{ p: "1rem", gap: 2 }}>
          <Button
            variant="text"
            onClick={() => handleCancelCreateOntology()}
            color="success"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => handleCreateOntology()}
            color="success"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
