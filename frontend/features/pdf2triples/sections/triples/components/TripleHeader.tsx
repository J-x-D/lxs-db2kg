import { useStore } from "store/store";
import { ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { RDFResource } from "features/pdf2triples/types/triple";
import ConfidenceScore from "./ConfidenceScore";
import { getLabel } from "../utils/getTripleLabelAndClass";

export default function TripleHeader({
  triple,
  isOpen,
}: {
  triple: RDFResource;
  isOpen: boolean;
}) {
  const {
    rdfResources,
    selectedRDFResource,
    setSelectedRDFResource,
    setPdf2triplesLxsHideConnections,
    setPdf2triplesLxsChangeMode,
    setPdf2triplesLxsTextOutlineColor,
    setPdf2triplesLxsSelectedText,
  } = useStore();

  const titleRef = React.useRef<HTMLParagraphElement>(null);

  const isEllipsisActive = (e: typeof titleRef.current) => {
    return !!e && e.offsetWidth < e.scrollWidth;
  };

  const subjectLabel = getLabel("subject", triple, rdfResources);
  const predicateLabel = getLabel("predicate", triple, rdfResources);
  const objectLabel = getLabel("object", triple, rdfResources);

  const title = `${subjectLabel} - ${predicateLabel} - ${objectLabel}`;

  let textColor = "black";
  let fontWeight = "normal";
  if (selectedRDFResource?.id) {
    if (selectedRDFResource?.id === triple?.id) {
      textColor = "black";
      fontWeight = "bold";
    } else {
      textColor = "text.secondary";
      fontWeight = "normal";
    }
  }

  const handleClick = () => {
    setPdf2triplesLxsSelectedText("");
    if (selectedRDFResource?.id === triple?.id) {
      setPdf2triplesLxsChangeMode(null);
      setPdf2triplesLxsHideConnections(false);
    }
    setSelectedRDFResource(
      selectedRDFResource?.id === triple?.id ? null : triple,
    );
    setPdf2triplesLxsTextOutlineColor(undefined);
  };

  return (
    <Stack
      onClick={() => handleClick()}
      width={"100%"}
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={2}
      sx={{
        cursor: "pointer",
      }}
    >
      <Tooltip
        title={isEllipsisActive(titleRef.current) && title}
        placement="top"
        arrow
      >
        <Stack flex={1} width="70%">
          <Collapse in={isOpen}>
            <Typography variant="body2" color={"text.secondary"}>
              Triple
            </Typography>
          </Collapse>
          <Typography
            ref={titleRef}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: textColor,
              fontWeight: fontWeight,
            }}
          >
            {title}
          </Typography>
        </Stack>
      </Tooltip>
      <Stack direction="row">
        <ConfidenceScore triple={triple} />

        <Tooltip
          arrow
          title={!!selectedRDFResource ? "Hide Details" : "Show Details"}
        >
          <IconButton onClick={() => handleClick()}>
            <ExpandMore
              sx={{
                transition: "transform 0.3s",
                transform:
                  selectedRDFResource?.id === triple?.id
                    ? "rotate(-180deg)"
                    : "rotate(0deg)",
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
