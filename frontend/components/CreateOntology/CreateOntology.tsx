import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CreateClass from "./CreateClass";
import GeneralOntologySettings from "./GeneralOntologySettings";
import { OntologyClass } from "types/OntologyClass";
import OntologyClassView from "./OntologyClassView";
import axios from "axios";
import { useStore } from "store/store";
import { useRouter } from "next/navigation";

export default function CreateOntology() {
  const { setOntologyUrls, ontologyUrls } = useStore();
  const [classes, setClasses] = useState<OntologyClass[]>([]);
  const [baseIRI, setBaseIRI] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(true);

  const [defaultClass, setDefaultClass] = useState<OntologyClass>(
    {} as OntologyClass,
  );

  const addClass = (ontologyClass: OntologyClass) => {
    setClasses([...classes, ontologyClass]);
  };

  const updateClass = (
    oldOntologyClass: OntologyClass,
    newOntologyClass: OntologyClass,
  ) => {
    const index = classes.findIndex((c) => c.name === oldOntologyClass.name);
    const newClasses = [...classes];
    newClasses[index] = newOntologyClass;
    setClasses(newClasses);
  };

  const deleteClass = (ontologyClass: OntologyClass) => {
    const newClasses = classes.filter((c) => c.name !== ontologyClass.name);
    setClasses(newClasses);
  };

  const uploadOntology = async () => {
    //close dialog for new ontology
    // setDialogOpen(false);

    setOpen(true);
    const ontology = {
      name,
      base_iri: baseIRI,
      classes,
    };
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/create_ontology",
      ontology,
    );

    const urls = structuredClone(ontologyUrls);
    urls.push(response.data);
    setOntologyUrls(urls);
    setOpen(false);
    redirectToOntologyTab();
  };

  const cancelEditing = () => {
    setDefaultClass({} as OntologyClass);
    setName("");
    setBaseIRI("");
  };

  const redirectToOntologyTab = () => {
    router.push("/new-rml/settings?tab=2");
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <Box
            component="div"
            display="flex"
            flexDirection="column"
            p={2}
            gap={2}
            height="70vh"
          >
            <Box
              component="div"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                component="div"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Typography variant="h4">Create new Ontology</Typography>
                <br />
                <Typography variant="body1">
                  Create a custom ontology and upload it to the server.
                </Typography>
              </Box>
              <Box component="div" display="flex" gap={2}>
                <Button onClick={() => redirectToOntologyTab()} variant="text">
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={() => uploadOntology()}
                >
                  Upload Ontology
                </Button>
              </Box>
            </Box>
            <Box component="div">
              <GeneralOntologySettings
                baseIRI={baseIRI}
                setBaseIRI={setBaseIRI}
                name={name}
                setName={setName}
              />
              <Box
                component="div"
                display="flex"
                flexDirection="row"
                gap={2}
                m="1rem 0"
              >
                <CreateClass
                  setDefaultClass={setDefaultClass}
                  cancelEditing={cancelEditing}
                  updateClass={updateClass}
                  addClass={addClass}
                  classes={classes}
                  defaultClass={defaultClass}
                />
                <OntologyClassView
                  deleteClass={deleteClass}
                  baseIRI={baseIRI}
                  classes={classes}
                  setDefaultClass={setDefaultClass}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={() => setOpen(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
