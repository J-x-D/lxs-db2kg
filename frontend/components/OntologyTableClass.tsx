import useFetchOntologyForTable from "hooks/useFetchOntologyForTable";
import { useStore } from "store/store";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";
import useFetchRelatedOntology from "hooks/useFetchRelatedOntology";
import { OntologyClassType } from "types/OntologyClassType";
import LanguageIcon from "@mui/icons-material/Language";
import { RmlRule } from "types/RmlRulesTypes";
import { uniq } from "lodash";
import { EditOutlined, Refresh, TableView } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

export default function OntologyTableClass({ rmlRule }: { rmlRule: RmlRule }) {
  const { selectedTable, database, ontologyUrls, rmlLoading, schema } =
    useStore();

  const [open, setOpen] = React.useState(false);
  const [possibleOntologyClasses, setPossibleOntologyClasses] = React.useState<
    OntologyClassType[]
  >([]);
  const [loading, setLoading] = React.useState(false);

  const { fetchRelatedOntology } = useFetchRelatedOntology(ontologyUrls);

  const { ontologyClass } = useFetchOntologyForTable();
  const [selectedOntologyClass, setSelectedOntologyClass] = React.useState("");

  useEffect(() => {
    if (
      ontologyClass &&
      possibleOntologyClasses.map((c) => c.class).includes(ontologyClass)
    ) {
      setSelectedOntologyClass(ontologyClass!);
    } else {
      if (ontologyClass) {
        setPossibleOntologyClasses((prev) => [
          ...prev,
          { class: ontologyClass!, from_ontology: false },
        ]);
        setSelectedOntologyClass(ontologyClass!);
      }
    }
    return () => {};
  }, [ontologyClass]);

  const fetchPossibleOntologyClasses = async () => {
    // TODO: add columns `table: ${selectedTable}, columns: ${}`
    const ontologies = await fetchRelatedOntology(`table: ${selectedTable}`);
    if (ontologies?.length === 0) return;
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/get_fitting_ontology_classes",
        {
          database,
          ontology: JSON.stringify(ontologies),
          table: selectedTable,
        },
      );
      // remove duplicates from possibleOntologyClasses and elements where class is null or undefined
      const filteredClasses: OntologyClassType[] = response.data.filter(
        (c: OntologyClassType) =>
          c.class && c.class !== "" && c.class.length > 1,
      );
      const uniqueClasses = uniq(filteredClasses);

      setPossibleOntologyClasses(uniqueClasses as OntologyClassType[]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleEditButtonClick = async () => {
    setOpen(true);
    if (possibleOntologyClasses.length > 1) return;
    setLoading(true);
    try {
      await fetchPossibleOntologyClasses();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Box component="div" display="flex" alignItems="center" gap={1}>
      {ontologyClass && <Typography>({ontologyClass})</Typography>}
      <IconButton
        onClick={() => handleEditButtonClick()}
        disabled={rmlLoading}
        color="primary"
      >
        <EditOutlined />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          flexDirection="row"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          margin={"0 !important"}
          padding={"16px !important"}
        >
          Edit Ontology Class
          {loading ? (
            <Box component="div" display="flex" alignItems="center" gap={1}>
              <Typography color="primary" variant="caption">
                Loading...
              </Typography>
              <IconButton onClick={() => handleEditButtonClick()}>
                <CircularProgress color="primary" size={24} />
              </IconButton>
            </Box>
          ) : (
            <Box component="div" display="flex" alignItems="center" gap={1}>
              <Typography color="primary" variant="caption">
                Refresh
              </Typography>
              <IconButton onClick={() => handleEditButtonClick()}>
                <Refresh color="primary" />
              </IconButton>
            </Box>
          )}
        </DialogTitle>
        {/* TODO: add toggle for custom vs AI generated - if custom is selected, then show TextField and update state */}
        <DialogContent>
          <Box
            component="div"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
          >
            {possibleOntologyClasses && possibleOntologyClasses?.length > 0 ? (
              <Box component="div" display="flex" alignItems="center" gap={1}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Class</InputLabel>
                  <Select
                    disabled={loading}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedOntologyClass}
                    label="Class"
                    onChange={(e) =>
                      setSelectedOntologyClass(e.target.value as string)
                    }
                  >
                    {possibleOntologyClasses.map((c) => (
                      <MenuItem key={uuidv4()} value={c.class}>
                        {c.class}
                        {!c.from_ontology && <LanguageIcon />}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <Box
                component="div"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                gap={1}
              >
                <TableView
                  color={"disabled"}
                  sx={{
                    fontSize: 100,
                  }}
                />
                <Typography color="text.secondary">
                  No classes found.{" "}
                  <Link
                    onClick={() => handleEditButtonClick()}
                    color="primary"
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    Refresh?
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        {
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                //   TODO: JD Update RML Rule
              }}
            >
              Save
            </Button>
          </DialogActions>
        }
      </Dialog>
    </Box>
  );
}
