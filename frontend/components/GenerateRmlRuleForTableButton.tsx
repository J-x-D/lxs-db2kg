import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import React from "react";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export default function GenerateRmlRuleForTableButton() {
  const [rmlRuleCreated, setRmlRuleCreated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const createRmlRule = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRmlRuleCreated(true);
    }, 2000);
  };

  if (rmlRuleCreated) {
    return (
      <>
        <Button
          sx={{ width: "15rem" }}
          variant='outlined'
          onClick={() => setOpen(true)}
          startIcon={<RemoveRedEyeIcon />}
        >
          Check Rml Rules
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Creating RML Rules</DialogTitle>
          <DialogContent>
            TODO: discuss with team how to display the RML rules
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        sx={{ width: "15rem" }}
        variant='outlined'
        onClick={() => createRmlRule()}
        startIcon={<AutoFixHighIcon />}
      >
        Create RML Rules
      </Button>
      <Dialog open={loading} onClose={() => setLoading(false)} maxWidth='sm'>
        <DialogTitle>Creating RML Rules</DialogTitle>
        <DialogContent>
          <LinearProgress />
        </DialogContent>
      </Dialog>
    </>
  );
}
