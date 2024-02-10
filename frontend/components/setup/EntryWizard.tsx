import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "store/store";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import FormInputTemplate from "./FormInputTemplate";
import axios from "axios";

interface OntologyConnection {
  url: string;
  errorText: string;
}
interface DatabaseConnection {
  connectionString: string;
  errorText: string;
}

export default function EntryWizard({
  open,
  handleCancel,
}: {
  open: boolean;
  handleCancel: Function;
}) {
  const defaultLogicalSource =
    process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING || "";

  const defaultOntologyConnection: OntologyConnection = {
    url: "",
    errorText: "",
  };

  const defaultDatabaseConnection: DatabaseConnection = {
    connectionString: defaultLogicalSource,
    errorText: "",
  };

  const [ontologyConnection, setOntologyConnection] =
    useState<OntologyConnection>(defaultOntologyConnection);

  const [databaseConnection, setDatabaseConnection] =
    useState<DatabaseConnection>(defaultDatabaseConnection);

  const router = useRouter();

  const { setDbConnectionString, setOntologyUrls, setAlert } = useStore();

  function handleCancelClick() {
    handleCancel();
    setOntologyConnection(defaultOntologyConnection);
    setDatabaseConnection(defaultDatabaseConnection);
  }

  async function handleSubmitClick() {
    if (isErrorInputStrings()) return;
    setDbConnectionString(databaseConnection.connectionString);
    setOntologyUrls([ontologyConnection.url]);
    const url =
      process.env.NEXT_PUBLIC_BACKEND_URL +
      "/create_embeddings?url=" +
      encodeURIComponent(ontologyConnection.url);
    axios
      .get(url)
      .then(() => {
        setAlert({
          open: true,
          message: "Embeddings created successfully",
          type: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setAlert({
          open: true,
          message: "Embeddings could not be created",
          type: "error",
        });
      });
    router.push("/");
  }

  function isErrorInputStrings(): boolean {
    setOntologyConnection({
      ...ontologyConnection,
      errorText: getErrorOntologyUrl(),
    });
    setDatabaseConnection({
      ...databaseConnection,
      errorText: getErrorDatabaseConnectionString(),
    });
    return (
      getErrorOntologyUrl() !== "" || getErrorDatabaseConnectionString() !== ""
    );
  }

  function getErrorOntologyUrl(): string {
    if (ontologyConnection.url === "") {
      return "Required Field";
    } else if (!isValidUrl(ontologyConnection.url)) {
      return "Invalid URL";
    } else {
      return "";
    }
  }

  function getErrorDatabaseConnectionString(): string {
    if (databaseConnection.connectionString === "") {
      return "Required Field";
    } else if (!isValidConnectionString(databaseConnection.connectionString)) {
      return "Invalid Connection String";
    } else {
      return "";
    }
  }

  const [connection, setConnection] = React.useState<Object>({
    connectionTested: false,
    connectionIsLoading: false,
    isConnectionPossible: false,
  });

  async function handleTestConnection() {
    // TODO make connection string dynamic by using env variables
    const url =
      "/api/test_connection?connection_string=" +
      encodeURIComponent(databaseConnection.connectionString);
    setConnection((prevState) => ({
      ...prevState,
      connectionIsLoading: true,
    }));
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setConnection((prevState) => ({
          ...prevState,
          isConnectionPossible: response?.data?.connected ?? false,
        }));
      } else {
        setConnection((prevState) => ({
          ...prevState,
          isConnectionPossible: false,
        }));
      }
    } catch (error) {}
    setConnection((prevState) => ({
      ...prevState,
      connectionTested: true,
      connectionIsLoading: false,
    }));
  }

  function isValidUrl(url: string): boolean {
    const regex = new RegExp(/^(https?|ftp|file):\/\/.*\.\w+$/);
    return regex.test(url);
  }

  function isValidConnectionString(url: string): boolean {
    return true;
    const regex = new RegExp(
      /^(\w+):\/\/(\w+(:\w+)?@)?([a-zA-Z0-9.-]+|\[[a-fA-F0-9:]+\])(:\d+)?(\/\w+)?(\?[\w&=]+)?$/i
    );
    return regex.test(url);
  }

  return (
    <Dialog
      open={open}
      onClose={() => handleCancel()}
      maxWidth="md"
      sx={{
        ".MuiPaper-root": {
          padding: 1,
        },
      }}
    >
      <Box component="div">
        <DialogTitle variant={"h4"}>Setup a new ontology</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Here you can setup a new Ontology. Please fill in all required
            fields.
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingBlock: 4,
              gap: 4,
            }}
          >
            <FormInputTemplate
              heading="Upload Ontologies"
              caption="You can define your own already built ontologies or you can create
            new ones using the ontology editor."
              helperText="Please enter a valid URL"
              value={ontologyConnection.url}
              placeholder={""}
              setValue={(e: string) =>
                setOntologyConnection({
                  ...ontologyConnection,
                  url: e,
                })
              }
              error={ontologyConnection.errorText}
              isValidUrl={isValidUrl}
            />
            <FormInputTemplate
              heading="Database Connection"
              caption="Conect to your database (e.g. postgres://reader:NWDMCE5xdipIjRrp@hh-pgsql-public.ebi.ac.uk:5432/pfmegrnargs)"
              helperText="Please provide the connection string"
              value={databaseConnection.connectionString}
              setValue={(e: string) =>
                setDatabaseConnection({
                  ...databaseConnection,
                  connectionString: e,
                })
              }
              error={databaseConnection.errorText}
              testAction={true}
              statusConnection={connection}
              setStatusConnection={setConnection}
              onTestClick={() => handleTestConnection()}
              isValidUrl={isValidConnectionString}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px", gap: 2 }}>
          <Button variant="text" onClick={() => handleCancelClick()}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => handleSubmitClick()}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
