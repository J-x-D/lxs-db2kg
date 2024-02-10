"use client";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab,
  Container,
  IconButton,
} from "@mui/material";
import { useStore } from "store/store";

import OntologiesList from "components/settings/ontologies/OntologiesList";
import TabPanel from "components/TabPanel";
import General, { GeneralHeader } from "components/settings/tabs/General";
import Database from "components/settings/tabs/Database";
import theme from "src/theme";
import { ArrowBack, ArrowLeft, ArrowRight } from "@mui/icons-material";
import Link from "next/link";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";
import defineStepSettings from "src/utils/defineStepSettings";
import { useSearchParams } from "next/navigation";

export default function Settings() {
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab");
  //   const { query }: { query: { tab?: number } } = router;

  const [currentTab, setCurrentTab] = useState<number>(0);

  const {
    purge,
    dbConnectionString,
    schema,
    ontologyUrls,
    createdEmbeddings,
    prefixes,
    setRmlLoading,
    setGlobalDisabled,
  } = useStore();

  useEffect(() => {
    setRmlLoading(false);
    setGlobalDisabled(false);
    return () => {};
  }, []);

  const [flowStep, setFlowStep] = useState<number>(0);
  const [updatedPrefixes, setUpdatedPrefixes] = useState<boolean>(false);
  useEffect(() => {
    let didUpdate = false;
    /* make sure prefix.url is not in ontology urls */
    prefixes.forEach((prefix) => {
      if (!ontologyUrls.includes(prefix.url)) {
        didUpdate = true;
      }
    });

    setUpdatedPrefixes(didUpdate && prefixes.length > 0);
  }, [prefixes]);

  async function getFlowStep() {
    const step = await defineStepSettings({
      dbConnectionString,
      schema,
      ontologyUrls,
      createdEmbeddings,
      updatedPrefixes,
    });
    setFlowStep(step);
  }

  useEffect(() => {
    getFlowStep();
  }, [
    dbConnectionString,
    schema,
    ontologyUrls,
    createdEmbeddings,
    updatedPrefixes,
  ]);

  const steps = [
    {
      title: "Database Configuration",
      description:
        'Your first step is to configure the database connection. To do this navigate to the "Database" tab. In there you will find a form to fill with the database connection details.',
    },
    {
      title: "Schema Configuration",
      description:
        "Now that you have a connection established to the database, you can configure the schema. Below the database connection form you will find a form to select the schema you wish to use.",
    },
    {
      title: "Ontologies Configuration",
      description:
        "Now that you have a connection established to the database and a schema selected, you can configure the ontologies. Go to the Ontology tab and select the ontologies you wish to use.",
    },
    {
      title: "Create Embeddings for the Ontologies",
      description:
        "Now that you have at least one ontology selected, you can create the embeddings for the ontologies. Go to the Ontology tab and click on the button to create the embeddings.",
    },
    {
      title: "Configure the Prefixes",
      description: (
        <>
          Now that you have the embeddings created, you can configure the
          prefixes. Go to the Prefixes tab and select the prefixes you wish to
          use. <br />
          <b>This step is optional.</b>
        </>
      ),
    },
    {
      title: "Finished Configuration",
      description:
        "You have finished the configuration. You can now exit the settings page and start using the application. If you wish to change the configuration, you can do so at any time.",
    },
  ];

  useEffect(() => {
    if (!!tab && !Number.isNaN(+tab)) {
      const coercedTab = Number(+tab);
      if (coercedTab >= 0 && coercedTab <= 2) {
        setCurrentTab(coercedTab); // Go to tab if query is set
      }
    }
  }, [tab]);

  return (
    <Box
      component="div"
      height="100%"
      minHeight="100vh"
      width="100%"
      sx={{
        borderRadius: 0,
        padding: 4,
        gap: 2,
      }}
      display={"flex"}
      bgcolor={theme.palette.background.default}
      flexDirection={"column"}
      boxSizing="border-box"
    >
      <Container>
        <Stack direction="row" alignItems="center" gap={2} marginBottom={4}>
          <Link href="/new-rml" passHref>
            <IconButton size="large">
              <ArrowBack />
            </IconButton>
          </Link>

          <Stack gap={0.5}>
            <Typography variant="h4">Settings</Typography>

            <Typography variant="body2">
              In this page you can configure a few settings for the application.
            </Typography>
          </Stack>
        </Stack>
        {/* half space symbol html */}

        <GuidanceInfoAlert
          title={
            <Stack direction={"row"} gap={0} alignItems={"center"}>
              <IconButton
                size="small"
                onClick={() => setFlowStep((prev) => (prev > 0 ? prev - 1 : 0))}
                disabled={flowStep === 0}
              >
                <ArrowLeft fontSize="inherit" />
              </IconButton>
              {flowStep + 1 === steps.length ? (
                <>{steps[flowStep]?.title}</>
              ) : (
                <>
                  {`Step ${flowStep + 1}\u2009/\u2009${
                    steps.length - 1
                  }:\u2009`}
                  <span style={{ fontWeight: "normal" }}>
                    {" " + steps[flowStep]?.title}
                  </span>
                </>
              )}
              <IconButton
                size="small"
                onClick={() =>
                  setFlowStep((prev) => (prev < steps.length ? prev + 1 : prev))
                }
                disabled={flowStep + 1 === steps.length}
              >
                <ArrowRight fontSize="inherit" />
              </IconButton>
            </Stack>
          }
          text={
            <Box component="div" ml={3.5}>
              {steps[flowStep]?.description}
            </Box>
          }
        />

        <Paper
          variant="outlined"
          sx={{
            marginTop: 2,
            padding: 4,
            paddingTop: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Tabs
              value={currentTab}
              onChange={(e, value) => setCurrentTab(value)}
            >
              <Tab label="Database" />
              <Tab label="Ontology" />
              <Tab label="General" />
            </Tabs>
            <Box component="div" gap={2} display="flex">
              <Button color="error" onClick={() => purge()}>
                Reset
              </Button>
            </Box>
          </Stack>

          <TabPanel
            header="Database Configuration"
            value={currentTab}
            index={0}
          >
            <Database />
          </TabPanel>

          <TabPanel
            header="Ontology Configuration"
            value={currentTab}
            index={1}
          >
            <OntologiesList />
          </TabPanel>

          <TabPanel header={<GeneralHeader />} value={currentTab} index={2}>
            <General />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
