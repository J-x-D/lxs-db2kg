import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import React from "react";
import { EditOutlined } from "@mui/icons-material";
import { useStore } from "store/store";
import { RDFResource } from "features/pdf2triples/types/triple";
import { getLabel, getTripleClass } from "../../utils/getTripleLabelAndClass";
import {
  getLabelBasedOnAccessKey,
  getValueBasedOnAccessKey,
} from "../../utils/getValueAndLabel";

export default function EditSubObject({
  triple,
  accessKey = "object",
  setEditStatus,
}: {
  triple: RDFResource;
  accessKey: "subject" | "object" | "predicate";
  setEditStatus: (status: "subject" | "object" | "predicate" | null) => void;
}) {
  const { rdfResources } = useStore();

  const friendlyAccessKey =
    accessKey.charAt(0).toUpperCase() + accessKey.slice(1);

  const handleClickEditButton = () => {
    setEditStatus(accessKey);
  };

  const label = getLabel(accessKey, triple, rdfResources);
  const className = getTripleClass(accessKey, rdfResources, triple);

  const p = getValueBasedOnAccessKey(accessKey, triple);
  const isExternalPredicate = !!getLabelBasedOnAccessKey(p, rdfResources);

  return (
    <>
      <ListItem
        secondaryAction={
          <Tooltip title={`Edit ${friendlyAccessKey}`} placement="left">
            <IconButton onClick={handleClickEditButton}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
        }
        sx={{
          width: "100%",
          "& .MuiListItemText-root": {
            mr: 4,
          },
        }}
      >
        <Tooltip title={friendlyAccessKey} placement="left">
          <ListItemAvatar id={`${accessKey}-box-${triple["@id"]}`}>
            <Avatar>{friendlyAccessKey.charAt(0)}</Avatar>
          </ListItemAvatar>
        </Tooltip>
        <ListItemText
          primary={label}
          secondary={
            accessKey === "predicate"
              ? isExternalPredicate
                ? "Custom predicate"
                : "External predicate"
              : `Class: ${className}`
          }
          sx={{
            "& .MuiListItemText-secondary, & .MuiListItemText-primary": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              minWidth: 0,
            },
          }}
        />
      </ListItem>
    </>
  );
}
