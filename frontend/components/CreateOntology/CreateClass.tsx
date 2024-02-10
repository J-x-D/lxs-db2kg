import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddProperty from "./AddProperty";
import { OntologyProperty } from "types/OntologyProperty";
import { OntologyClass } from "types/OntologyClass";

export default function CreateClass({
  addClass,
  classes,
  defaultClass,
  updateClass,
  cancelEditing,
  setDefaultClass,
}: {
  addClass: (ontologyClass: OntologyClass) => void;
  cancelEditing: () => void;
  updateClass: (
    oldOntologyClass: OntologyClass,
    newOntologyClass: OntologyClass,
  ) => void;
  classes: OntologyClass[];
  defaultClass: OntologyClass;
  setDefaultClass: (ontologyClass: OntologyClass) => void;
}) {
  const [name, setName] = useState(defaultClass.name ?? "");
  const [subClassOf, setSubClassOf] = useState(defaultClass.subClassOf ?? "");

  const [properties, setProperties] = useState<OntologyProperty[]>(
    defaultClass.properties ?? [],
  );

  const addPropertyToClass = (property: OntologyProperty) => {
    setProperties([...properties, property]);
  };

  const addOntologyClass = () => {
    const ontologyClass: OntologyClass = {
      name,
      subClassOf,
      properties,
    };
    addClass(ontologyClass);
    resetForm();
  };

  const updateOntologyClass = () => {
    const ontologyClass: OntologyClass = {
      name,
      subClassOf,
      properties,
    };
    updateClass(defaultClass, ontologyClass);
    setDefaultClass({} as OntologyClass);
    resetForm();
  };

  const resetForm = () => {
    // reset form
    setName("");
    setSubClassOf("");
    setProperties([]);
    setDefaultClass({} as OntologyClass);
  };

  useEffect(() => {
    setName(defaultClass.name ?? "");
    setSubClassOf(defaultClass.subClassOf ?? "");
    setProperties(defaultClass.properties ?? []);
  }, [defaultClass]);

  return (
    <Paper variant="outlined" sx={{ width: "50%" }}>
      <Box component="div" display="flex" flexDirection="column" p={2}>
        <Typography variant="subtitle2">Class Editor</Typography>
        <Box
          component="div"
          display="flex"
          flexDirection="column"
          gap={2}
          m="1rem 0"
        >
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* Select with all class names */}
          {classes.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Subclass of</InputLabel>
              <Select
                disabled={
                  classes.filter((c) => c.name !== defaultClass.name).length ===
                  0
                }
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subClassOf}
                label="Subclass of"
                onChange={(e) => setSubClassOf(e.target.value as string)}
              >
                {classes
                  .filter((c) => c.name !== defaultClass.name)
                  .map((c) => (
                    <MenuItem value={c.name} key={c.name}>
                      {c.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          {/* Display attributes as chips */}
          <Box component="div">
            <Box component="div" display="flex" justifyContent="space-between">
              <Typography variant="subtitle1">Properties</Typography>

              <AddProperty
                classes={classes}
                addPropertyToClass={addPropertyToClass}
              />
            </Box>

            <Box component="div" display="flex" gap={1} flexWrap="wrap" p={1}>
              {properties.length === 0 ? (
                <Typography
                  variant="body2"
                  style={{
                    color: "#808080",
                    backgroundColor: "#F7F7F7",
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "20px",
                  }}
                >
                  No properties yet
                </Typography>
              ) : (
                properties.map((property, i) => (
                  <Chip
                    key={i}
                    label={
                      property["DatatypeProperty"] ?? property["ObjectProperty"]
                    }
                    onDelete={() => {
                      setProperties(properties.filter((a) => a !== property));
                    }}
                  />
                ))
              )}
            </Box>
          </Box>
        </Box>
        <Box component="div" display="flex" gap={2} justifyContent="flex-end">
          {defaultClass.name && (
            <Button color="primary" onClick={() => cancelEditing()}>
              Cancel
            </Button>
          )}

          <Button color="primary" onClick={() => resetForm()}>
            Reset
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              defaultClass.name ? updateOntologyClass() : addOntologyClass()
            }
          >
            {defaultClass.name ? "Update Class" : "Add Class"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
