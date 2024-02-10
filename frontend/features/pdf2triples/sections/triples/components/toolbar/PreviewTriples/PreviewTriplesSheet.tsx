import { Close } from "@mui/icons-material";
import { AppBar, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import DownloadTriples from "../DownloadTriples/DownloadTriples";
import PreviewTriplesGraph from "./PreviewTriplesGraph";
import ToolbarGroup from "components/ui-components/CustomToolbar/ToolbarGroup";

export default function PreviewTriplesSheet({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Function;
}) {
  return (
    <Drawer
      sx={{ borderRadius: "0", backgroundColor: "#F7F7F7" }}
      anchor={"right"}
      open={open}
      onClose={() => setOpen(false)}
      variant="persistent"
    >
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderRadius: 0 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderRadius: 0,
          }}
        >
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: "0 1rem",
            }}
          >
            Preview Triples
          </Typography>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <ToolbarGroup minWidth="42px" height="42px">
              <DownloadTriples solo={true} />
            </ToolbarGroup>
          </div>
        </Toolbar>
      </AppBar>
      <div style={{ width: "49.9vw", height: "100vh" }}>
        <PreviewTriplesGraph />
      </div>
    </Drawer>
  );
}
