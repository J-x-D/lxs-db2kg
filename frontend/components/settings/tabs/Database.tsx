import React, { useEffect, useState } from "react";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useStore } from "store/store";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";
import { Check, Close, Refresh } from "@mui/icons-material";
import axios from "axios";
import useFetchDatabaseSchema from "hooks/useFetchDatabaseSchema";

const CustomSchemaSelect = dynamic(
  () => import("components/ui-components/CustomSchemaSelect"),
  {
    ssr: false,
  }
);

export default function Database() {
  const { dbConnectionString, setDbConnectionString, schema, setSchema } =
    useStore();

  const {
    fetchDatabaseSchema,
    schemas,
    allTableNames,
    tablesForSchemaNames,
    error: dbError,
  } = useFetchDatabaseSchema();

  async function handleSetSchema(schema: string) {
    const newSchema = await fetchDatabaseSchema(schema);
    setSchema(newSchema ? newSchema : schema);

    /* console.log(
      "🚀 ~ file: Database.tsx ~ line 50 ~ handleSetSchema ~ schema",
      newSchema
    ); */
  }

  async function testConnection() {
    const url =
      "/api/test_connection?connection_string=" +
      encodeURIComponent(dbConnectionString);

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  const [isConnection, setIsConnection] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    testConnection().then((res) => {
      if (dbConnectionString !== "") {
        if (res) {
          setIsConnection(true);
        } else {
          setIsConnection(false);
        }
      }
    });
    if (dbConnectionString === "") {
      setIsConnection(undefined);
    }
  }, [dbConnectionString]);

  return (
    <Stack gap={4}>
      <GuidanceInfoAlert
        title="Database Connection String"
        text={
          <>
            The database connection string will be used to connect to your
            database. <br />
            <b>This is required for the application to work.</b>
          </>
        }
      ></GuidanceInfoAlert>
      <TextField
        sx={{
          marginTop: -2,
        }}
        value={dbConnectionString}
        onChange={(e) => setDbConnectionString(e.target.value)}
        label="Database Connection String"
        variant="outlined"
        fullWidth
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip
                title={
                  isConnection === undefined
                    ? "Test connection"
                    : isConnection
                    ? "Connection successful"
                    : "Connection failed"
                }
              >
                <IconButton
                  aria-label="test connection"
                  onClick={() => {
                    testConnection().then((res) => {
                      if (res) {
                        setIsConnection(true);
                      } else {
                        setIsConnection(false);
                      }
                    });
                  }}
                >
                  {isConnection === undefined ? (
                    <Refresh />
                  ) : isConnection ? (
                    <Check color="success" />
                  ) : (
                    <Close color="error" />
                  )}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      <CustomSchemaSelect
        setSchema={handleSetSchema}
        schema={schema}
        dbConnectionString={dbConnectionString}
      />
    </Stack>
  );
}
