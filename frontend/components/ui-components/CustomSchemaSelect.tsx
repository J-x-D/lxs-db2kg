import React, { useEffect } from "react";
import {
  Badge,
  Box,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import useFetchDatabaseSchema from "hooks/useFetchDatabaseSchema";
import { Refresh } from "@mui/icons-material";
import { useStore } from "store/store";
import theme from "src/theme";
import GuidanceInfoAlert from "../Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

export default function CustomSchemaSelect({
  schema,
  setSchema,
  dbConnectionString,
}: {
  schema: string;
  setSchema: Function;
  dbConnectionString: string;
}) {
  const { schemas } = useStore();
  const { fetchDatabaseSchema } = useFetchDatabaseSchema();
  const [showBadge, setShowBadge] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (schemas?.length > 0 && !schema) {
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
  }, [schemas, schema]);

  useEffect(() => {
    if (schemas?.length === 1 && !schema) {
      setSchema(schemas[0]);
    }
  }, [schemas]);

  useEffect(() => {
    if (dbConnectionString === "") {
      fetchDatabaseSchema();
    }
  }, [dbConnectionString]);

  return (
    <GuidanceInfoAlert
      title="Schema"
      text={
        <>
          The schema is the database schema that will be used to query the
          different tables. <b>Please select a schema.</b> If there are no
          schemas, please check your database connection string and try
          refreshing the schemas by clicking the refresh button.
        </>
      }
    >
      <Badge
        color="primary"
        badgeContent={schemas.length}
        invisible={!showBadge}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          component="div"
          width="100%"
          display="flex"
          alignItems="center"
          gap="1rem"
        >
          <TextField
            value={schemas?.length > 0 ? schema : ""}
            onChange={(e) => setSchema(e.target.value)}
            select
            label="Schema"
            variant="outlined"
            required
            fullWidth
          >
            {(schemas.length === 0 || schema) && (
              <MenuItem value="">
                <em
                  style={{
                    color: theme.palette.grey[500],
                  }}
                >
                  None
                </em>
              </MenuItem>
            )}
            {schemas?.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip title="Refresh schema options">
            <IconButton onClick={() => fetchDatabaseSchema()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Badge>
    </GuidanceInfoAlert>
  );
}
