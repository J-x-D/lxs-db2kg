import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import theme from "../../src/theme";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { useStore } from "store/store";
import { PlayArrow } from "@mui/icons-material";
import useFetchRmlRules from "hooks/useFetchRmlRules";
import axios from "axios";
import { saveAs } from "file-saver";
import useFetchDatabaseSchema from "hooks/useFetchDatabaseSchema";

import { useRouter } from "next/navigation";

export default function CustomSideBar() {
  const ref = React.useRef<HTMLAnchorElement | null>(null);
  const [search, setSearch] = React.useState<string>("");
  const [filteredTableNames, setFilteredTableNames] = React.useState<string[]>(
    [],
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  const router = useRouter();

  const {
    rmlRules,
    setSelectedTable,
    selectedTable,
    setAlert,
    rmlLoading,
    dbConnectionString,
    globalDisabled,
    schema,
  } = useStore();

  const { tablesForSchemaNames } = useFetchDatabaseSchema();

  React.useEffect(() => {
    if (schema) {
      setSelectedTable(tablesForSchemaNames[0]);
    }
  }, [schema]);

  const { autoFetchRmlRules } = useFetchRmlRules();

  const isElementSelected = (tableName: string) => selectedTable === tableName;

  React.useEffect(() => {
    setFilteredTableNames(tablesForSchemaNames);
  }, [tablesForSchemaNames]);

  async function handleButtonClick(value: number) {
    if (value === 10) {
      setLoading(true);
      autoFetchRmlRules();
      setLoading(false);
    }

    if (value === 20) {
      // combine rmlRules into one array
      const rules = Object.values(rmlRules).reduce((acc: any, val) => {
        return acc.concat(val);
      }, []);

      try {
        setAlert({
          open: true,
          message:
            "For this experiment, you will receive only the mapping file and not the actual Knowledge Graph.",
          type: "success",
        });
        const result = await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/run_rml_mapper",
          {
            rules,
            connection_string: dbConnectionString,
          },
        );
        const blob = new Blob([result.data], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blob, `Mapping_${new Date().toISOString()}.ttl`);
      } catch (error) {
        setAlert({
          open: true,
          message: "Something went wrong while running the RML mapper",
          type: "error",
        });
      }
    }
  }

  React.useEffect(() => {
    if (search === "") {
      setFilteredTableNames(tablesForSchemaNames);
    } else {
      setFilteredTableNames(
        tablesForSchemaNames.filter((tableName) =>
          tableName.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search]);

  return (
    <Paper
      sx={{
        borderRadius: 0,
        boxSizing: "border-box",
        height: "100vh",
        position: "fixed",
        width: "300px",
        p: "2rem",
        paddingY: "1rem",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
      }}
      variant="outlined"
    >
      <Stack spacing={4} boxSizing={"border-box"} overflow={"auto"}>
        <Box component="div" display={"flex"} justifyContent={"space-between"}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
            }}
          >
            LXS
          </Typography>
          <IconButton
            sx={{
              aspectRatio: "1/1",
              width: "40px",
              height: "40px",
              marginBlock: "auto",
              borderRadius: theme.shape.borderRadius + "px",
            }}
            disabled={globalDisabled}
            onClick={() => router.push("/new-rml/settings")}
          >
            <SettingsOutlinedIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Welcome to LXS. Here you can manage your RML rules.
        </Typography>
        {/* Search */}
        <TextField
          onChange={(e) => setSearch(e.target.value)}
          label="Search Classes"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {/*  */}
        <Stack sx={{ gap: 1, marginTop: 0 }} overflow={"auto"}>
          <Box
            component="div"
            sx={{
              gap: 1.8,
              display: "flex",
              paddingInline: 1.6,
              paddingBottom: 0,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              RML
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Tables
            </Typography>
          </Box>
          <Box
            component="div"
            overflow="auto"
            height={"auto"}
            maxHeight={"100%"}
          >
            {filteredTableNames?.map((tableName, index) => {
              return (
                <Button
                  key={index}
                  onClick={() => setSelectedTable(tableName)}
                  sx={{
                    width: "100%",
                    gap: 2,
                    p: 2,
                    justifyContent: "flex-start",
                    backgroundColor: isElementSelected(tableName)
                      ? "#e3eefc"
                      : "transparent",
                    color: isElementSelected(tableName)
                      ? "#3f51b5"
                      : "text.secondary",
                    "&:hover": {
                      backgroundColor: isElementSelected(tableName)
                        ? "#e3eefc"
                        : "#f5f5f5",
                      color: isElementSelected(tableName)
                        ? "#3f51b5"
                        : "text.primary",
                    },
                  }}
                  startIcon={
                    <CheckIcon
                      sx={{
                        opacity: rmlRules[tableName] ? 1 : 0.33,
                      }}
                      color={rmlRules[tableName] ? "primary" : "disabled"}
                    />
                  }
                >
                  {tableName}
                </Button>
              );
            })}
          </Box>
        </Stack>
      </Stack>
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        gap="0.5rem"
        padding="0.25rem"
      >
        <ToggleButtonGroup
          fullWidth
          color="primary"
          size="small"
          onChange={(e, value) => handleButtonClick(value[0])}
        >
          <Tooltip title="Auto-generate RML Rules for all">
            <ToggleButton
              value={10}
              disabled={rmlLoading || globalDisabled}
              sx={{
                color: theme.palette.primary.main,
              }}
            >
              <Box component="div" display="flex" gap="0.25rem">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <AutoAwesomeIcon /> Generate
                  </>
                )}
              </Box>
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Create a Knowledge Graph">
            <ToggleButton
              value={20}
              // ssr -> does not work
              disabled={
                rmlLoading ||
                Object.keys(rmlRules || []).length === 0 ||
                globalDisabled
              }
              sx={{
                color: theme.palette.primary.main,
              }}
            >
              <Box component="div" display="flex" gap="0.25rem">
                {false ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <PlayArrow /> Run
                  </>
                )}
              </Box>
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
}
