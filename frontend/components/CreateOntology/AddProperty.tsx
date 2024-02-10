import { useStore } from "store/store";
import { OntologyProperty } from "types/OntologyProperty";
import { OntologyClass } from "types/OntologyClass";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";

export default function AddProperty({
  addPropertyToClass,
  classes,
}: {
  addPropertyToClass: (property: OntologyProperty) => void;
  classes: OntologyClass[];
}) {
  const { prefixes } = useStore();
  const [open, setOpen] = useState(false);
  const [property, setProperty] = useState<OntologyProperty>({});

  // "owl:DatatypeProperty" : "<label>"
  const [type, setType] = useState<"ObjectProperty" | "DatatypeProperty">(
    "DatatypeProperty",
  );
  const [label, setLabel] = useState<string>("");
  const [range, setRange] = useState<string>("");
  const [datatype, setDatatype] = useState<
    | "String"
    | "Integer"
    | "Float"
    | "Boolean"
    | "Date"
    | "Time"
    | "DateTime"
    | "Language-tagged string"
  >("String");

  const handleAddClick = () => {
    const ontologyProperty: OntologyProperty = {
      [type]: label,
      range: type === "DatatypeProperty" ? "Literal" : range,
    };
    if (type === "DatatypeProperty") {
      ontologyProperty.datatype = datatype;
    }

    addPropertyToClass(ontologyProperty);
    setType("DatatypeProperty");
    setLabel("");
    setRange("");
    setDatatype("String");
    setOpen(false);
  };

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        size="small"
        onClick={() => setOpen(true)}
      >
        {/* variant="outlined"  */}
        Add
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add Property</DialogTitle>
        <DialogContent>
          <Box
            component="div"
            display="flex"
            flexDirection="column"
            gap={2}
            m="1rem 0"
          >
            <Box
              component="div"
              display="flex"
              flexDirection="row"
              gap={1}
              m="1rem 0"
            >
              <FormControl sx={{ width: "50%" }}>
                <InputLabel id="is-defined-label">Property Type </InputLabel>
                <Select
                  labelId="property-type-label"
                  id="property-type-id"
                  value={type}
                  label="Property Type"
                  onChange={(e) =>
                    setType(
                      e.target.value as "ObjectProperty" | "DatatypeProperty",
                    )
                  }
                >
                  <MenuItem value={"DatatypeProperty"}>
                    DatatypeProperty
                  </MenuItem>
                  <MenuItem value={"ObjectProperty"}>ObjectProperty</MenuItem>
                </Select>
              </FormControl>
              {type === "ObjectProperty" && (
                <FormControl sx={{ width: "50%" }}>
                  <InputLabel id="range-label">Range</InputLabel>
                  <Select
                    labelId="range-label"
                    id="range-label-id"
                    value={range}
                    label="Range"
                    onChange={(e) => setRange(e.target.value as string)}
                  >
                    {classes.map((c, i) => (
                      <MenuItem value={c.name} key={i}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
            <TextField
              fullWidth
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              label="Label"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setType("DatatypeProperty");
              setLabel("");
              setRange("");
              setDatatype("String");
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => handleAddClick()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
