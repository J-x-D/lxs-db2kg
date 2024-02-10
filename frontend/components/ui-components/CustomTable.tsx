import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Skeleton,
  Alert,
  AlertTitle,
  Link,
  Stack,
  Collapse,
  TablePagination,
} from "@mui/material";
import { useStore } from "store/store";
import useFetchTableInfo from "hooks/useFetchTableInfo";
import useFetchPredicatesForColumns from "hooks/useFetchPredicatesForColumns";
import useFetchOntologyForTable from "hooks/useFetchOntologyForTable";
import theme from "src/theme";
import PredicatePrefixTableCell from "./PredicatePrefixTableCell/PredicatePrefixTableCell";
import { v4 as uuidv4 } from "uuid";
import GuidanceInfoAlert from "../Guidance/GuidanceInfoAlert/GuidanceInfoAlert";
import {
  AutoAwesome,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import NoSSR from "../NoSSR";
import ChooseTableLayout from "../ChooseTableLayout";
import EditOntologyClass from "./EditOntologyClass";

type TableRow = {
  name?: string;
  id?: number;
  rmlChecked?: boolean;
};

export default function CustomTable() {
  const {
    fetchTableInfo,
    tableInfo,
    loading,
    error: fetchTableInfoError,
  } = useFetchTableInfo();
  const [editOntologyClassOpen, setEditOntologyClassOpen] = useState(false);
  const [open, setOpen] = useState(true);

  const { predicatesForColumns, fetchPredicatesForColumns } =
    useFetchPredicatesForColumns();

  const { ontologyClass } = useFetchOntologyForTable();

  const {
    selectedTable,
    dbConnectionString,
    rmlRules,
    globalDisabled,
    advancedMode,
    tableRows,
    tablesOrientation,
    database,
    schema,
  } = useStore();

  useEffect(() => {
    fetchPredicatesForColumns();
    return () => {};
  }, [rmlRules[selectedTable]]);

  const rowsOptions = [5, 10, 15, 20, 25, 30, 50, { value: -1, label: "All" }];

  if (!rowsOptions.includes(tableRows)) {
    rowsOptions.unshift(tableRows);
  }

  const [currentTablePage, setCurrentTablePage] = useState<
    | number
    | {
        value: number;
        label: string;
      }
  >(0);
  const disabled = !selectedTable || !rmlRules[selectedTable] || globalDisabled;
  const [localTableRows, setLocalTableRows] = useState<number>(tableRows);

  const schemaIndex = database.schemaTableColumnMap.findIndex(
    (map) => map.schema === schema,
  );

  const isMappingTable = (t: string) =>
    !!database?.schemaTableColumnMap?.[schemaIndex]?.tables?.find(
      (table) =>
        table.tableName === t &&
        table.columnNames.length < (table?.relations?.length ?? 0),
    );

  if (fetchTableInfoError || !dbConnectionString) {
    return (
      <NoSSR>
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
          }}
        >
          <Alert severity="warning">
            <AlertTitle>
              The connection to the database could not be established
            </AlertTitle>
            Please go to the <Link href="/new-rml/settings">settings</Link> page and
            check if you entered the correct connection string.
          </Alert>
        </Paper>
      </NoSSR>
    );
  }

  return (
    <NoSSR>
      <Stack gap={4}>
        <GuidanceInfoAlert
          title={disabled ? "Generate RML Rules" : "Table"}
          text={
            disabled ? (
              <>
                You don&apos;t have any RML rules yet. To start, please select a
                table and generate the RML rules, by clicking the{" "}
                <AutoAwesome fontSize="inherit" /> Auto-Generate Button in the
                toolbar.
              </>
            ) : (
              "The second row of this table shows the predicates that are used in the RML rules. The badges help you to identify which predicates exist and which don't. It is recommended to change the predicates to the ones that actually exist. You can do this by clicking on the table cell with the predicate and selecting a new predicate from the dropdown menu."
            )
          }
        ></GuidanceInfoAlert>

        <Paper
          variant="outlined"
          sx={{
            boxSizing: "border-box",
            width: "100%",
            height: "max-content",
          }}
        >
          <TableContainer
            sx={{
              borderRadius: theme.shape.borderRadius + "px",
              width: "100%",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <Box
              component="div"
              sx={{
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
              <Stack>
                <Typography variant="h6">
                  {selectedTable?.toUpperCase() || "-"}
                </Typography>

                <Stack direction={"row"} gap={0.5} alignItems={"center"}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#8b8b8b",
                    }}
                  >
                    {ontologyClass ?? "-"}
                  </Typography>
                  {ontologyClass && (
                    <IconButton
                      onClick={() => setEditOntologyClassOpen(true)}
                      size="small"
                    >
                      <Edit fontSize="inherit" />
                    </IconButton>
                  )}
                  <EditOntologyClass
                    currentOntologyClass={ontologyClass}
                    open={editOntologyClassOpen}
                    setOpen={setEditOntologyClassOpen}
                  />
                </Stack>
              </Stack>

              <IconButton onClick={() => setOpen(!open)} disabled={loading}>
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
            <Collapse in={open}>
              {/* box to handle overflow */}
              <Box
                component="div"
                sx={{
                  overflowX: "auto",
                  width: "100%",
                  height: "auto",
                }}
              >
                <Table
                  aria-label="simple table"
                  sx={
                    tablesOrientation === "horizontal"
                      ? {
                          width: "100%",
                          tableLayout: "fixed",
                          "& .MuiTable-root": {
                            width: "100%",
                          },
                          "& .MuiTableHead-root": {
                            width: "100%",
                          },
                        }
                      : {
                          width: "100%",
                        }
                  }
                >
                  {loading ? (
                    <Table
                      aria-label="simple table"
                      sx={
                        tablesOrientation === "horizontal"
                          ? {
                              width: "100%",
                              tableLayout: "fixed",
                              "& .MuiTable-root": {
                                width: "100%",
                              },
                              "& .MuiTableHead-root": {
                                width: "100%",
                              },
                            }
                          : {
                              width: "100%",
                            }
                      }
                    >
                      <TableHead>
                        <TableRow>
                          {Array.from(Array(6).keys()).map((i) => (
                            <TableCell key={i}>
                              <Skeleton
                                variant="text"
                                sx={{ fontSize: "inherit" }}
                                animation="wave"
                                width={210}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      {/* repeat 5 times */}
                      <TableBody>
                        {Array.from(Array(3).keys()).map((i) => (
                          <TableRow key={uuidv4()}>
                            {Array.from(Array(6).keys()).map((i) => (
                              <TableCell key={uuidv4()}>
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "inherit" }}
                                  animation="wave"
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <ChooseTableLayout layout={tablesOrientation}>
                      <TableHead sx={{ whiteSpace: "nowrap" }}>
                        <TableRow>
                          {tableInfo?.columns?.map((column: string) => (
                            <TableCell key={column}>{column}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody sx={{ whiteSpace: "nowrap" }}>
                        {/* first row, that displays the predicates and classes based on the ontology */}
                        <TableRow
                          sx={{
                            // disable hover effect
                            backgroundColor: "rgba(227, 238, 252, 0.4)",
                            "&:hover": {
                              backgroundColor: "rgba(227, 238, 252, 0.4)",
                            },
                          }}
                        >
                          {/* id stays empty */}
                          {!isMappingTable(selectedTable) && (
                            <TableCell>{""}</TableCell>
                          )}
                          {/* all other display predicate with prefix:<stuff> */}
                          {tableInfo?.columns?.map((col: string) => (
                            <PredicatePrefixTableCell
                              key={col}
                              column={col}
                              predicatesForColumns={predicatesForColumns}
                            />
                          ))}
                        </TableRow>
                        {tableInfo?.rows?.map((row: any, i) => {
                          const currPage =
                            typeof currentTablePage === "number"
                              ? currentTablePage
                              : currentTablePage.value;

                          if (
                            (i >= localTableRows * currPage &&
                              i < localTableRows * (currPage + 1)) ||
                            localTableRows === -1
                          ) {
                            return (
                              <TableRow
                                key={row.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                {Object.keys(row).map((key) => (
                                  <TableCell key={key}>{row[key]}</TableCell>
                                ))}
                              </TableRow>
                            );
                          }
                          return null;
                        })}
                      </TableBody>
                    </ChooseTableLayout>
                  )}
                </Table>
              </Box>
              {advancedMode && (
                <Box component="div" paddingY={1} paddingX={2}>
                  <TablePagination
                    rowsPerPageOptions={rowsOptions}
                    component="div"
                    count={tableInfo?.rows?.length || 0}
                    rowsPerPage={localTableRows}
                    page={currentTablePage as number}
                    onPageChange={(_, p) => setCurrentTablePage(p)}
                    onRowsPerPageChange={(e) => {
                      setLocalTableRows(Number(e.target.value));
                      setCurrentTablePage(0);
                    }}
                    sx={{
                      "& .MuiTablePagination-caption": {
                        fontSize: "inherit",
                      },
                    }}
                  />
                </Box>
              )}
            </Collapse>
          </TableContainer>
        </Paper>
      </Stack>
    </NoSSR>
  );
}
