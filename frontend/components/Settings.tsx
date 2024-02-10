import { Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useStore } from "store/store";
export default function Settings({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { purge } = useStore();

  const [systemConnection, setSystemConnection] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (open) verifySystemConnection();
    return () => {};
  }, [open]);

  const verifySystemConnection = async () => {
    setLoading(true);
    try {
      const result = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/");
      setSystemConnection(result.status === 200);
    } catch (error) {
      setSystemConnection(false);
    }
    setLoading(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(!open)}
      variant="temporary"
    >
      <Box component="div" width={200} padding={1}>
        <Toolbar />
        <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
          Settings
        </Typography>
        <Box component="div" display="flex" flexDirection="column" gap={2}>
          <Divider />
          <Box component="div" display="flex" alignItems="center" gap="1rem">
            {loading ? (
              <CircularProgress />
            ) : (
              <FiberManualRecordIcon
                color={systemConnection ? "success" : "error"}
              />
            )}

            {systemConnection ? (
              <Typography>Connected</Typography>
            ) : (
              <Typography>Not Connected</Typography>
            )}
            <Tooltip title="Check connection to backend">
              <span>
                <IconButton
                  disabled={loading}
                  onClick={() => verifySystemConnection()}
                >
                  <Refresh />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Divider />
          <Button
            variant="outlined"
            disableElevation
            color="secondary"
            onClick={() => {
              purge();
            }}
          >
            Delete local data
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
