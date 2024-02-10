import React from "react";
import ImportPDFURL from "./ImportPDFURL";
import { DialogContentText, Stack, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel, TabPanelProps } from "@mui/lab";
import { ExtractedTextResponse } from "features/pdf2triples/sections/content/types/pdfResponse";
import ImportTextString from "./ImportTextString";

export default function InputText({
  handleClose,
  handleNext,
}: {
  handleClose: () => void;
  handleNext: (formData: ExtractedTextResponse, source: string) => void;
}) {
  const [selectedTab, setSelectedTab] = React.useState<"url" | "file">("url");
  const CustomTabPanel = (props: TabPanelProps) => {
    return <TabPanel sx={{ p: 0 }} {...props} />;
  };

  return (
    <Stack
      gap={2}
      sx={{
        py: 0,
      }}
    >
      <DialogContentText>
        Import text from a pdf url or a basic text string.
      </DialogContentText>
      <TabContext value={selectedTab}>
        <TabList
          onChange={(event, value) => setSelectedTab(value)}
          aria-label="lab API tabs example"
          variant="fullWidth"
        >
          <Tab label="pdf url" value="url" />
          <Tab label="basic text" value="text" />
        </TabList>

        <CustomTabPanel value="url">
          <ImportPDFURL handleNext={handleNext} handleClose={handleClose} />
        </CustomTabPanel>
        <CustomTabPanel value="text">
          <ImportTextString handleNext={handleNext} handleClose={handleClose} />
        </CustomTabPanel>
      </TabContext>
    </Stack>
  );
}
