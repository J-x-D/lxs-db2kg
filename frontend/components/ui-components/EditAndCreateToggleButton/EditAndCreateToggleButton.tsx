import { useStore } from "store/store";
import { Triples } from "types/Triples";
import { EditOutlined } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React from "react";
import EditToggleButton from "../CustomToolbar/ToggleButtons/EditToggleButton";
import EditAndCreateSubmit from "./EditAndCreateSubmit";
import PredicateField from "./components/PredicateField";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

export default function EditAndCreateToggleButton({
  triple,
  isInToolbar,
}: {
  triple?: Triples;
  isInToolbar?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState<string>(
    getSubject(triple?.subject ?? "id"),
  );
  const [object, setObject] = React.useState<string>(triple?.object ?? "");
  const [table, setTable] = React.useState<string>(triple?.table ?? "");
  const [predicate, setPredicate] = React.useState<string>(
    triple?.predicate ?? "",
  );

  // Error States
  const [createTripleError, setCreateTripleError] = React.useState<string>("");
  const [subjectHasError, setSubjectHasError] = React.useState<boolean>(false);
  const [predicateHasError, setPredicateHasError] =
    React.useState<boolean>(false);
  const [columnHasError, setColumnHasError] = React.useState<boolean>(false);
  const [tableHasError, setTableHasError] = React.useState<boolean>(false);

  const [objectTarget, setObjectTarget] = React.useState<string>(
    triple?.parentTriplesMap ? "table" : "column",
  );

  const { database, schema, selectedTable, rmlLoading, globalDisabled } =
    useStore();

  function getSubject(tripleSubject: string) {
    const regex = /\{([^}]+)\}/; // Matches any character that is not a closing curly brace

    const match = tripleSubject.match(regex);
    if (match) {
      return match[1];
    }
    return tripleSubject;
  }

  const groupedColumsByTable = database.schemaTableColumnMap
    .find((schemaTableColumnMap) => schemaTableColumnMap.schema === schema)
    ?.tables.map((tableInfo) => {
      return tableInfo.columnNames.map((columnName) => {
        return {
          table: tableInfo.tableName as string,
          column: columnName,
        };
      });
    })
    .reduce((acc, curr) => acc.concat(curr), []);

  function clearAll() {
    setSubject("");
    setObject("");
    setPredicate("");
    setTable("");
  }

  function setErrors() {
    setSubjectHasError(subject === "");
    setPredicateHasError(predicate === "");
    setColumnHasError(object === "");
    setTableHasError(table === "");
    if (
      subject === "" ||
      predicate === "" ||
      object === "" ||
      (objectTarget === "table" && table === "")
    ) {
      return true;
    }
    return false;
  }
  return (
    <>
      {isInToolbar ? (
        <EditToggleButton handleButtonClick={() => setOpen(true)} />
      ) : (
        <IconButton
          disabled={rmlLoading || globalDisabled}
          edge="end"
          aria-label="edit"
          onClick={() => {
            setOpen(true);
            setSubject(getSubject(triple?.subject ?? ""));
            setObject(triple?.object ?? "");
            setPredicate(triple?.predicate ?? "");
          }}
          color="primary"
          sx={{
            background: "#f6f9fd",
            "&:hover": {
              background: "#ddddf2",
            },
          }}
        >
          <EditOutlined />
        </IconButton>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            height: "max-content",
          },
        }}
      >
        <DialogTitle>{isInToolbar ? "Create" : "Edit"} Triple</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "0 8px",
            }}
          >
            {/* subject */}
            <Autocomplete
              disabled={triple?.subject !== undefined}
              disablePortal
              id="combo-box-subject"
              options={
                groupedColumsByTable ?? [
                  {
                    table: "None",
                    column: "None",
                  },
                ]
              }
              groupBy={(option) => option.table}
              getOptionLabel={(option) => option.column}
              fullWidth
              onChange={(_, newValue) => {
                if (newValue) {
                  setSubject(newValue.column);
                }
              }}
              value={{ table: selectedTable, column: subject }}
              inputValue={subject}
              onInputChange={(_, newInputValue) => {
                setSubject(newInputValue);
                setSubjectHasError(newInputValue === "");
              }}
              isOptionEqualToValue={(option, value) =>
                option.column === value.column
              }
              renderInput={(params) => (
                <FormControl
                  fullWidth
                  required
                  error={(!!subject && subject === object) || subjectHasError}
                >
                  <InputLabel htmlFor="subject">Subject</InputLabel>
                  <OutlinedInput {...params} label="Subject" id="subject" />
                  <FormHelperText>
                    {!!subject && subject === object
                      ? "Subject and Object must differ"
                      : subjectHasError
                        ? "This field is required"
                        : " "}
                  </FormHelperText>
                </FormControl>
              )}
            />
            {/* predicate */}
            <PredicateField
              predicateDefault={predicate}
              setNewPredicate={setPredicate}
              predicateHasError={predicateHasError}
              setPredicateHasError={setPredicateHasError}
            />
            <Typography variant="subtitle1">Object</Typography>
            <GuidanceInfoAlert
              text={
                <>
                  If you want to map a column, select the column tab and select
                  the column you want to map. If you want to join a column with
                  a table, select the table tab. Then you can select the column
                  you want to join first and then select the table you want to
                  join the column with.
                </>
              }
            />
            <ToggleButtonGroup
              exclusive
              aria-label="Object Target"
              value={objectTarget}
              size="small"
              fullWidth
              onChange={(e, value) => {
                setObjectTarget(value);
              }}
            >
              <ToggleButton value="table">Table</ToggleButton>
              <ToggleButton value="column">Column</ToggleButton>
            </ToggleButtonGroup>
            {/* object */}

            <Stack direction="column" spacing={2}>
              <Autocomplete
                disablePortal
                ListboxProps={{ style: { maxHeight: 300 } }}
                id="column selector"
                options={
                  groupedColumsByTable?.filter(
                    (column) => column.table === selectedTable,
                  ) ?? []
                }
                getOptionLabel={(option) => option.column}
                fullWidth
                value={{
                  table: selectedTable,
                  column: object,
                }}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setObject(newValue.column);
                  }
                  setColumnHasError(newValue?.column === "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Column"
                    placeholder={
                      objectTarget === "table"
                        ? "Column of your current table you want to join with another table"
                        : "Column you want to map with your subject"
                    }
                    helperText={
                      subject && subject === object
                        ? "Subject and Object must differ"
                        : columnHasError
                          ? "This field is required"
                          : ""
                    }
                    error={(!!subject && subject === object) || columnHasError}
                  />
                )}
              />
              <Collapse in={objectTarget === "table"}>
                <Autocomplete
                  disablePortal
                  ListboxProps={{ style: { maxHeight: 300 } }}
                  id="table-selector"
                  options={
                    // creating a set to remove duplicates from the array
                    Array.from(
                      new Set(
                        groupedColumsByTable?.map((column) => column.table) ??
                          [],
                      ),
                    )
                      .map((table) => {
                        return table;
                      })
                      .filter((table) => table !== selectedTable) ?? []
                  }
                  fullWidth
                  value={table}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setTable(newValue);
                    }
                    setTableHasError(newValue === "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Table"
                      placeholder="Table you want to join"
                      helperText={
                        subject && subject === object
                          ? "Subject and Object must differ"
                          : tableHasError
                            ? "This field is required"
                            : " "
                      }
                      error={(!!subject && subject === object) || tableHasError}
                    />
                  )}
                />
              </Collapse>
            </Stack>
            {createTripleError !== "" && (
              <Alert
                severity="error"
                onClose={() => {
                  setCreateTripleError("");
                }}
              >
                <AlertTitle>
                  Could not {isInToolbar ? "create" : "edit"} triple
                </AlertTitle>
                {createTripleError}
              </Alert>
            )}
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
          }}
        >
          <Button
            onClick={() => {
              clearAll();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <EditAndCreateSubmit
            objectTarget={objectTarget}
            oldTriple={
              triple ?? { subject: "", predicate: "", object: "", table: "" }
            }
            setError={setCreateTripleError}
            checkRequiredFields={setErrors}
            newTriple={{ subject, predicate, object, table }}
            isEditMode={!isInToolbar}
            callBackFn={() => {
              clearAll();
              setOpen(false);
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
