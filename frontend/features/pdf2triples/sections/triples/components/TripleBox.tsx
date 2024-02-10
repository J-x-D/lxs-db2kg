import { useStore } from "store/store";
import { Badge, Box } from "@mui/material";
import React from "react";
import { CheckTripleErrorState } from "./checkTripleStatus";
import theme from "src/theme";
import { RDFResource } from "features/pdf2triples/types/triple";
import { getColor } from "src/color";
import getHashedComment from "../utils/getHashedComment";

export default function TripleBox({
  children,
  tripleError,
  triple,
}: {
  children: React.ReactNode;
  tripleError: CheckTripleErrorState;
  triple: RDFResource;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const { selectedRDFResource } = useStore();

  const isDarker = selectedRDFResource?.id === triple.id;

  const isOtherTripleSelected =
    selectedRDFResource !== null && selectedRDFResource?.id !== triple.id;
  const hash = getHashedComment(triple);
  const color = getColor(hash, isDarker, isOtherTripleSelected);

  return (
    <Badge
      color="error"
      badgeContent={"!"}
      invisible={!tripleError.hasError}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        width: "100%",
      }}
    >
      <Box
        id={`rdf-box-${triple.id}`}
        component="div"
        ref={ref}
        bgcolor={"background.default"}
        sx={{
          borderRadius: theme.shape.borderRadius + "px",
          width: "100%",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
          },
        }}
      >
        <Box
          component="div"
          sx={{
            p: 2,
            boxSizing: "border-box",
            transition: "background-color 0.3s",
          }}
          bgcolor={color}
          borderRadius={1}
          height={"min-content"}
        >
          {children}
        </Box>
      </Box>
    </Badge>
  );
}
