import React from "react";
import BaseOverflowMenuItem from "../base/BaseOverflowMenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import OneSideDialog from "features/pdf2triples/components/OneSideDialog";
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import PromptStepper from "./PromptStepper";
import { RemoveCircle } from "@mui/icons-material";
import { useStore } from "store/store";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

export default function Settings({ handleClose }: { handleClose: () => void }) {
  const { resetPrompts } = useStore();
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  return (
    <>
      <BaseOverflowMenuItem
        handleClick={() => setDialogOpen(true)}
        tooltipLabel={"Settings"}
      >
        <SettingsIcon color="primary" /> Prompt Settings
      </BaseOverflowMenuItem>
      <OneSideDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <SettingsIcon /> Prompt Settings
        </DialogTitle>
        <DialogContent>
          <GuidanceInfoAlert
            text={
              <>
                The following prompts will be used to generate triples. You can
                edit them here. After editing, click the <strong>Save</strong>{" "}
                button to save your changes. You can then close this dialog.
              </>
            }
          />
          <PromptStepper />
          <Stack direction="column" spacing={2} sx={{ marginTop: "2rem" }}>
            <Alert severity="warning">
              You can reset all your prompts with clicking on the button below.
            </Alert>
            <Button
              onClick={() => resetPrompts()}
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<RemoveCircle />}
            >
              Reset Prompts
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </OneSideDialog>
    </>
  );
}
