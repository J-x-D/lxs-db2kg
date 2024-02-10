"use client";
import { useStore } from "store/store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  tooltipClasses,
} from "@mui/material";
import React, { useEffect } from "react";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; //Example style, you can use another
import Editor from "react-simple-code-editor";
import theme from "src/theme";
import { Close, ContentCopy, Download } from "@mui/icons-material";
import axios from "axios";
import styled from "@emotion/styled";

const SuccessTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

export default function CustomRuleViewDialog({
  open,
  setOpen,
  handleCreateRMLRules,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleCreateRMLRules: () => void;
  }) {
  const [_document, setDocument] = React.useState<any>(null); 
  const [code, setCode] = React.useState("");
  const [hasRMLRules, setHasRMLRules] = React.useState(false);
  const { selectedTable, rmlRules, setAlert } = useStore();
  const [copyStringTooltipOpen, setCopyStringTooltipOpen] =
    React.useState<boolean>(false);
  const [_navigator, setNavigator] = React.useState<any>(null);

  useEffect(() => {
    setNavigator(navigator);
  }, []);

  async function changeCodeToTurtle(code: string): Promise<string> {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/getTurtle";
    try {
      const response = await axios.post(url, code, {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      // setAlert({
      //   open: true,
      //   message: "Could not change code to JSON",
      //   type: "error",
      // });
    }
    return "";
  }

  useEffect(() => {
    const fetchData = async () => {
      if (hasRMLRules) {
        const jsonCode = JSON.stringify(rmlRules[selectedTable], null, 2);
        setCode(await changeCodeToTurtle(jsonCode));
      }
    };

    fetchData();
  }, [rmlRules, selectedTable, hasRMLRules]);

  useEffect(() => {
    setHasRMLRules(!!rmlRules[selectedTable]);
  }, [rmlRules, selectedTable]);

  useEffect(() => {
    setDocument(document);
  }, []);



  function handleDownloadRMLRules() {
    const element = _document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "rml_rules_lxs.ttl";
    _document.body.appendChild(element);
    element.click();
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        View RML Rules
        <DialogActions>
          <IconButton onClick={() => setOpen(false)} size="medium">
            <Close fontSize="inherit" />
          </IconButton>
        </DialogActions>
      </DialogTitle>
      <DialogContent>
        {!hasRMLRules ? (
          <Stack gap={2}>
            <ManageSearchRoundedIcon sx={{ fontSize: 100 }} color="disabled" />
            <Typography variant="h6">
              No RML rules found for this table
            </Typography>
            <Typography variant="body2">
              Click{" "}
              <Link
                onClick={() => handleCreateRMLRules()}
                color="primary"
                sx={{
                  cursor: "pointer",
                }}
              >
                here
              </Link>{" "}
              to generate RML Rules
            </Typography>
          </Stack>
        ) : (
          <div
            style={{
              position: "relative",
              backgroundColor: "#f7f7f7",
              padding: 0,
              border: "1px solid #e0e0e0",
              borderRadius: theme.shape.borderRadius + "px",
              maxHeight: 500,
              overflowY: "scroll",
            }}
          >
            <SuccessTooltip
              open={copyStringTooltipOpen}
              title="Copied to clipboard"
              placement="left"
              sx={{
                bgcolor: theme.palette.success.main,
                color: theme.palette.background.paper,
                [`& .${tooltipClasses.tooltip}`]: {
                  backgroundColor: theme.palette.success.main,
                  color: theme.palette.background.paper,
                },
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 1,
                  color: theme.palette.grey[500],
                  "&:hover": {
                    color: theme.palette.grey[700],
                  },
                }}
                onClick={() => _navigator.clipboard.writeText(code)}
                size="small"
              >
                <ContentCopy fontSize="inherit" />
              </IconButton>
            </SuccessTooltip>
            {code && (
              <Editor
                value={code}
                onValueChange={(code: any) => console.log(code)}
                highlight={(code: any) =>
                  Prism.highlight(code, Prism.languages.js, "js")
                }
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 12,
                  margin: 2,
                }}
              />
            )}
          </div>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          marginX: 2,
          mb: 2,
        }}
      >
        <Button
          onClick={() => handleDownloadRMLRules()}
          color="primary"
          variant="contained"
        >
          <Download sx={{ mr: 1 }} fontSize={"small"} />
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}
