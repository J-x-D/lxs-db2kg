import { useStore } from "store/store";
import { Cancel, Check } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Stack,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";

export default function CreateEmbeddingsButton({
  selectedOntologies,
  showAlert = false,
  setShowAlert,
}: {
  selectedOntologies: (string | undefined)[];
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setAlert, createdEmbeddings, setCreatedEmbeddings } = useStore();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const timerRef = React.useRef<number>();

  React.useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );

  // remove all feedback states after selection changes
  useEffect(() => {
    setLoading(false);
    setSuccess(false);
    setIsError(false);
  }, [selectedOntologies]);

  useEffect(() => {
    if (success || isError) {
      setTimeout(() => {
        setLoading(false);
        setSuccess(false);
        setIsError(false);
      }, 6000);
    }
  }, [success, isError]);

  const createEmbeddings = async () => {
    if (selectedOntologies.length < 1) {
      setIsError(true);
      setLoading(false);
      setSuccess(false);
      return setAlert({
        open: true,
        message: "Please select at least one ontology",
        type: "error",
      });
    }
    setLoading(true);
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/process_ontology";
    try {
      const response = await axios.post(url, {
        ontologies: selectedOntologies,
      });
      setAlert({
        open: true,
        message: "Embeddings created successfully",
        type: "success",
      });

      if (response.status === 200) {
        setCreatedEmbeddings(true);
        setSuccess(true);
        setIsError(false);
        setLoading(false);
      }

      /* timerRef.current = window.setTimeout(() => {
        if (loading) {
          setLoading(false);
          //setSuccess(true); // change this later
        } else {
          setLoading(true);
        }
      }, 1000); */
    } catch (error) {
      console.error(error);
      setLoading(false);
      setIsError(true);
      setCreatedEmbeddings(false);
      setAlert({
        open: true,
        message: "Embeddings could not be created",
        type: "error",
      });
      // setSuccess(false);
    }
  };
  useEffect(() => {
    if (selectedOntologies.length > 1 && selectedOntologies[0] !== "") {
      setLoading(false);
    }
  }, [selectedOntologies]);

  useEffect(() => {
    if (loading || success) setShowAlert(false);
    if (loading) setIsError(false);
  }, [success, loading]);

  return (
    <Stack gap={2}>
      <Button
        variant="outlined"
        onClick={() => createEmbeddings()}
        color={
          loading
            ? "primary"
            : success
              ? "success"
              : isError
                ? "error"
                : "primary"
        }
        disabled={selectedOntologies.length < 1}
      >
        {loading ? (
          <Stack direction="row" spacing={1}>
            <Stack>Loading Embeddings... </Stack>
            <CircularProgress size={20} />
          </Stack>
        ) : (
          <Stack
            direction={"row"}
            gap={1}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {!loading ? "Create Embeddings" : "Loading Embeddings..."}
            {loading ? (
              <CircularProgress size={20} />
            ) : success ? (
              <Check />
            ) : isError ? (
              <Cancel color="error" />
            ) : (
              ""
            )}
          </Stack>
        )}
      </Button>
      {showAlert && (
        <Stack>
          <Alert severity="info">
            <AlertTitle>Create Embeddings</AlertTitle>
            Please remember to update your new Embeddings to ensure that you are
            working with the latest version.
          </Alert>
        </Stack>
      )}
    </Stack>
  );
}
