import React from "react";
import BaseOverflowMenuItem from "../base/BaseOverflowMenuItem";
import OneSideDialog from "features/pdf2triples/components/OneSideDialog";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import TopicSuggestions from "features/pdf2triples/sections/content/components/toolbar/ImportPdf/Dialog/steps/topics/TopicSuggestions";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import { useStore } from "store/store";

export default function EditTopics({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { pdf2triplesGlobalPdf } = useStore();
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  return (
    <>
      <BaseOverflowMenuItem
        handleClick={() => setDialogOpen(true)}
        tooltipLabel={"Settings"}
      >
        <FormatSizeIcon color="primary" /> Edit Topics
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
          <FormatSizeIcon /> Edit Topics
        </DialogTitle>
        <DialogContent>
          <TopicSuggestions
            text={pdf2triplesGlobalPdf?.text ?? ""}
            disableAutoFetch={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </OneSideDialog>
    </>
  );
}
