import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useStore } from "store/store";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { KNOWN_KEYS, RDFResource } from "features/pdf2triples/types/triple";
import { getLabel } from "../utils/getTripleLabelAndClass";

const options = ["Remap Triple (ontology-based)", "Remap Triple (no ontology)"];

export default function RemapTriple({ triple }: { triple: any }) {
  const { ontologyUrls, prompts, prefixes, rdfResources, setRDFResources } =
    useStore();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const remapNoOntology = async (
    triplesToRemap: RDFResource[],
    predicate: string,
  ) => {
    const prompt = prompts
      .find((p) => p.label === "Remap Triple (No Ontology)")
      ?.prompt.replace("<placeholder_triple>", JSON.stringify(triplesToRemap))
      .replace(
        "<placeholder_prefixes>",
        `[${prefixes.map((p) => `"${p.prefix}"`)}]`,
      )
      .replaceAll("<placeholder_predicate>", predicate);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/execute`,
      {
        prompt,
        serialize: false,
      },
    );
    return JSON.parse(response.data);
  };

  const remapOntologyBased = async (triplesToRemap: RDFResource[]) => {
    return Promise.all(
      triplesToRemap.map(async (triple) => {
        const newTriple = structuredClone(triple) as RDFResource;
        // check if triple defines a subject
        if (
          Object.keys(triple).includes(
            "http://www.w3.org/2000/01/rdf-schema#comment",
          )
        ) {
          const label = getLabel("subject", triple, rdfResources);
          const response = (await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_classes`,
            {
              ontologies: ontologyUrls,
              query: label,
            },
          )) as {
            data: {
              class: string;
              ontology_url: string;
              score: number;
            }[];
          };
          const className = `${response.data?.[0]?.ontology_url}/${response.data?.[0]?.class}`;
          if (newTriple["@type"]) newTriple["@type"] = [className];
          return newTriple;
        }
        // check if triple defines an predicate
        if (
          (triple["@type"] as string[])[0] ===
          "http://www.w3.org/2002/07/owl#ObjectProperty"
        ) {
          return triple;
        } else {
          const newTriple = structuredClone(triple) as RDFResource;
          // has to be object
          const label = getLabel("object", triple, rdfResources);
          const response = (await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_classes`,
            {
              ontologies: ontologyUrls,
              query: label,
            },
          )) as {
            data: {
              class: string;
              ontology_url: string;
              score: number;
            }[];
          };
          const className = `${response.data?.[0]?.ontology_url}/${response.data?.[0]?.class}`;

          if (newTriple["@type"]) newTriple["@type"] = [className];
          return newTriple;
        }
      }),
    );
  };

  const handleClick = async () => {
    setLoading(true);

    const triplesToRemap: RDFResource[] = [triple];
    const predicate = Object.keys(triple).filter(
      (key) => !KNOWN_KEYS.includes(key),
    )?.[0];
    const predicateTriple = rdfResources.find(
      (r: RDFResource) => r?.["@id"] === predicate,
    );
    if (predicateTriple) triplesToRemap.push(predicateTriple);

    const object = triple[predicate]?.[0]?.["@id"];
    const objectTriple = rdfResources.find(
      (r: RDFResource) => r?.["@id"] === object,
    );
    if (objectTriple) triplesToRemap.push(objectTriple);

    try {
      let newTriples: RDFResource[] = [];
      if (selectedIndex === 0) {
        newTriples = (await remapOntologyBased(
          triplesToRemap,
        )) as RDFResource[];
      }
      if (selectedIndex === 1) {
        newTriples = (await remapNoOntology(
          triplesToRemap,
          predicate,
        )) as RDFResource[];
      }
      // find triple with a comment
      let id = newTriples.filter((t: RDFResource) => {
        return Object.keys(t).includes(
          "http://www.w3.org/2000/01/rdf-schema#comment",
        );
      })?.[0]?.id;
      // remove the triple based on the id
      const newRDFResources = rdfResources.filter(
        (t: RDFResource) => t.id !== id,
      );
      const combined = newRDFResources.concat(newTriples);

      setRDFResources(combined);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup ref={anchorRef} aria-label="split button">
        <Button
          disabled={loading}
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            "&:hover": {
              backgroundColor: "#f9f9f9",
            },
          }}
          fullWidth
          variant="contained"
          startIcon={loading && <CircularProgress size={16} />}
          onClick={handleClick}
        >
          {loading ? "Remapping Triple..." : options[selectedIndex]}
        </Button>
        <Button
          disabled={loading}
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            "&:hover": {
              backgroundColor: "#f9f9f9",
            },
          }}
          variant="contained"
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
          width: "90%",
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem
                    disabled={ontologyUrls.length === 0}
                    selected={0 === selectedIndex}
                    onClick={() => handleMenuItemClick(0)}
                  >
                    {options[0]}
                  </MenuItem>
                  <MenuItem
                    selected={1 === selectedIndex}
                    onClick={() => handleMenuItemClick(1)}
                  >
                    {options[1]}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
