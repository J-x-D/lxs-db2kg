import { useStore } from "store/store";
import { Triples } from "types/Triples";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import EditAndCreateToggleButton from "./EditAndCreateToggleButton/EditAndCreateToggleButton";
import theme from "src/theme";
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SchemaIcon from "@mui/icons-material/Schema";
import useFetchTableInfo from "hooks/useFetchTableInfo";
import DeleteTripleButton from "./DeleteTripleButton";

import { AutoAwesome } from "@mui/icons-material";
import { TableInfo } from "types/SchemaTableColumnMap";
import GuidanceInfoAlert from "../Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

type GroupedTriples = {
  [key: string]: Triples[];
};

interface AllTableData {
  [key: string]: TableInfo;
}

export default function CustomRuleView() {
  const {
    selectedTable,
    rmlRules,
    setAlert,
    setSelectedTable,
    dbConnectionString,
    tablesOrientation,
  } = useStore();

  const {
    tableInfo,
    fetchTableInfo,
    error: tableInfoError,
  } = useFetchTableInfo();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [triples, setTriples] = useState<GroupedTriples>({});
  const [hasTriples, setHasTriples] = useState(false);
  const [allTableData, setAllTableData] = useState<AllTableData>({});

  useEffect(() => {
    const groupedTripleNames = Object.keys(triples);
    groupedTripleNames
      .map((tripleName) => triples[tripleName][0].table)
      .map(async (tableName) => {
        const tableData = await fetchTableInfo(tableName);

        const copy = structuredClone(allTableData);

        copy[tableName] = tableData;
        setAllTableData(copy as any);
      });
  }, [triples]);

  async function fetchTriples() {
    setLoading(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/get_rml_rule_triples",
        rmlRules[selectedTable],
      );

      const groupedTriples: GroupedTriples = result.data
        .filter((triple: Triples) => {
          return triple.object !== "id";
        })
        .reduce(
          (acc: any, triple: Triples) => {
            if (acc[triple.subject]) {
              acc[triple.subject].push(triple);
            } else {
              acc[triple.subject] = [triple];
            }
            return acc;
          },
          {} as { [key: string]: Triples[] },
        );
      console.log(groupedTriples);

      setTriples(groupedTriples);
    } catch (error) {
      setAlert({
        open: true,
        message: "Could not fetch triples",
        type: "error",
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    setTriples({});
    if (rmlRules[selectedTable]) fetchTriples();
  }, [selectedTable, rmlRules]);

  useEffect(() => {
    const hasTriplesLocal = !!triples && Object.keys(triples).length > 0;
    setHasTriples(hasTriplesLocal);

    if (!hasTriplesLocal) setOpen(false);
  }, [triples]);

  function formatPredicate(predicate: string) {
    // if predicate contains a # return everything after the #
    if (predicate?.includes("#")) {
      return predicate?.split("#")[1];
    }

    // if predicate contains a / return everything after the /
    if (predicate?.includes("/")) {
      return predicate
        ?.split("/")
        [predicate.split("/").length - 1].toLocaleLowerCase();
    }

    return predicate;
  }

  const isJoinedTable = (triple: Triples) => {
    return (
      triple.object?.includes("http://") || triple.object?.includes("https://")
    );
  };

  function formatObject(triple: Triples) {
    if (!triple.object) return "-";

    if (
      triple.object?.includes("http://") ||
      triple.object?.includes("https://")
    ) {
      if (triple.object.split("_").length > 3) {
        const splitted = triple.object.split("_");
        return (
          splitted[1].toLocaleUpperCase() +
          "_" +
          splitted[2].toLocaleUpperCase()
        );
      }
      return triple.object.split("_")[1].toLocaleUpperCase();
    }
    // @ts-ignore
    return allTableData[triple.table]?.rows[0]?.[triple.object];
  }

  useEffect(() => {
    setOpen(tablesOrientation === "horizontal");
  }, [tablesOrientation]);

  if (tableInfoError !== "" || !dbConnectionString) {
    return <></>;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        height: "max-content",
      }}
    >
      <div
        style={{
          height: "3rem",
          transition: "all 0.3s ease-in-out",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: 1.8,
          paddingBlock: 4,
          backgroundColor: "#e3eefc",
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
          borderBottomLeftRadius: open ? 0 : theme.shape.borderRadius,
          borderBottomRightRadius: open ? 0 : theme.shape.borderRadius,
        }}
      >
        <Box component="div" display="flex" flexDirection="column">
          <Typography variant="h6">Mapping</Typography>
        </Box>

        <IconButton onClick={() => setOpen(!open)} disabled={loading}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </div>
      <Collapse in={open}>
        <Box component="div" paddingX={5} paddingTop={3}>
          <GuidanceInfoAlert text="The following area represents examples of the created mapping file." />
        </Box>
        {hasTriples ? (
          Object.keys(triples).map((subject, index) => {
            return (
              <Stack paddingY={4} spacing={2} key={index}>
                <Paper
                  key={subject}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginX: 5,
                    marginBottom: 2,
                    p: 2,
                  }}
                  variant="outlined"
                >
                  <Typography variant="subtitle1">
                    <strong>Subject</strong>
                  </Typography>
                  <Typography variant="subtitle1">{subject}</Typography>
                </Paper>
                <Box
                  component="div"
                  display="grid"
                  gridTemplateColumns={
                    tablesOrientation === "horizontal" ? "1fr" : "1fr 1fr"
                  }
                  flexWrap="wrap"
                  paddingX={5}
                  justifyContent="space-between"
                  gap={2}
                >
                  {triples[subject].map((triple) => (
                    <Paper
                      key={triple.predicate}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        boxSizing: "border-box",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0 0.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.2rem",
                          }}
                        >
                          <Typography variant="subtitle1">
                            {/* @ts-ignore */}
                            <strong>{tableInfo?.rows[0]?.id}</strong>
                          </Typography>
                          <Typography>
                            {formatPredicate(triple.predicate)}
                          </Typography>
                          <Typography
                            sx={{
                              cursor: isJoinedTable(triple)
                                ? "pointer"
                                : "auto",
                              textDecoration: isJoinedTable(triple)
                                ? "underline"
                                : "none",
                              maxWidth: "25ch",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            variant="subtitle1"
                            onClick={() =>
                              isJoinedTable(triple) &&
                              setSelectedTable(
                                formatObject(triple).toLowerCase(),
                              )
                            }
                          >
                            <strong>{formatObject(triple)}</strong>
                          </Typography>
                        </div>
                        {/* delete and edit buttons */}
                        <Box component="div" display="flex" gap={2}>
                          <EditAndCreateToggleButton triple={triple} />
                          <DeleteTripleButton triple={triple} />
                        </Box>
                      </div>
                      <Paper
                        sx={{
                          m: 1,
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                        variant="outlined"
                      >
                        <Typography variant="overline">Predicate</Typography>
                        <Typography>
                          {formatPredicate(triple.predicate)}
                        </Typography>
                      </Paper>

                      <Paper
                        variant="outlined"
                        sx={{
                          m: 1,
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <Typography variant="overline">Object</Typography>
                        <Typography>{triple.object}</Typography>
                      </Paper>
                    </Paper>
                  ))}
                </Box>
              </Stack>
            );
          })
        ) : (
          <Stack gap={2} p={5}>
            <SchemaIcon sx={{ fontSize: 100 }} color="disabled" />
            <Typography variant="h6">No Triples found</Typography>
            <Typography variant="body2">
              Click on the <AutoAwesome fontSize="inherit" /> button on the top
              of this page to generate new rules.
            </Typography>
          </Stack>
        )}
      </Collapse>
    </Paper>
  );
}
