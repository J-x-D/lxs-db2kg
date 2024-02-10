import {
  Avatar,
  Collapse,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import TripleHeader from "./TripleHeader";
import { useStore } from "store/store";
import RemapTriple from "./RemapTriple";
import { RDFResource, RDFValue } from "features/pdf2triples/types/triple";
import WordsInput from "../WordsInput";
import { EditOutlined } from "@mui/icons-material";
import theme from "src/theme";

export default function TripleLayout({
  children,
  triple,
}: {
  children: React.ReactNode;
  triple: RDFResource;
}) {
  const {
    selectedRDFResource,
    rdfResources,
    setRDFResources,
    setPdf2triplesLxsTextOutlineColor,
    setPdf2triplesLxsHideConnections,
    setPdf2triplesLxsSelectedText,
  } = useStore();
  const isSelected = selectedRDFResource?.id === triple.id;
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const comment =
    (
      selectedRDFResource?.[
        "http://www.w3.org/2000/01/rdf-schema#comment"
      ] as RDFValue[]
    )?.[0]?.["@value"] ?? "";

  const handleTextChange = (text: string) => {
    if (!selectedRDFResource) return;
    if (!text) return;
    const newTriple = structuredClone(selectedRDFResource) as RDFResource;
    newTriple["http://www.w3.org/2000/01/rdf-schema#comment"] = [
      {
        "@value": text,
      },
    ];
    const newRDFResources = rdfResources.map((r) => {
      if (r.id === newTriple.id) return newTriple;
      return r;
    });
    setRDFResources(newRDFResources);
  };

  const handleExpandToggle = () => {
    setPdf2triplesLxsSelectedText("");
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (!selectedRDFResource) setExpanded(false);

    return () => {};
  }, [selectedRDFResource]);

  useEffect(() => {
    if (expanded) {
      setPdf2triplesLxsHideConnections(true);
      setPdf2triplesLxsTextOutlineColor("rgb(63, 81, 181)");
    } else {
      setPdf2triplesLxsTextOutlineColor(undefined);
      setPdf2triplesLxsHideConnections(false);
    }

    return () => {};
  }, [expanded]);

  return (
    <Stack gap={isSelected ? 2 : 0}>
      <TripleHeader triple={triple} isOpen={isSelected} />
      <Collapse in={isSelected}>
        <Stack gap={2}>
          <Stack borderRadius={1.5} gap={2} bgcolor={"background.default"}>
            {children}
          </Stack>
          <RemapTriple triple={triple} />
          <Stack
            bgcolor={"background.default"}
            gap={1}
            borderRadius={theme.shape.borderRadius + "px"}
          >
            <ListItem
              secondaryAction={
                <IconButton onClick={handleExpandToggle}>
                  <EditOutlined />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Tooltip title="Comment" placement="left">
                  <Avatar>C</Avatar>
                </Tooltip>
              </ListItemAvatar>
              <ListItemText
                primary="Edit Sentence"
                secondary="Links to a triple's comment"
              />
            </ListItem>
            <Collapse in={expanded} unmountOnExit>
              <Stack p={1}>
                <WordsInput initialText={comment} setText={handleTextChange} />
              </Stack>
            </Collapse>
          </Stack>
        </Stack>
      </Collapse>
    </Stack>
  );
}
