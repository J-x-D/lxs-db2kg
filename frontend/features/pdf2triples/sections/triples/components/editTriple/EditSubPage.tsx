import { Divider, IconButton, Stack, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { RDFResource } from "features/pdf2triples/types/triple";
import EditSPOSubPage from "./EditSPOSubPage";

type SubpageProps = {
  triple: RDFResource;
  accessKey: "subject" | "object" | "predicate";
  goBack: () => void;
};

export default function EditSubpage({
  triple,
  accessKey,
  goBack,
}: SubpageProps) {
  const friendlyAccessKey =
    accessKey.charAt(0).toUpperCase() + accessKey.slice(1);

  return (
    <Stack p={2} gap={2}>
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <IconButton
          sx={{
            marginBlock: "-3px",
          }}
          onClick={goBack}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant={"h6"}>Editing {friendlyAccessKey}</Typography>
      </Stack>
      <Divider />
      <Stack gap={2}>
        <EditSPOSubPage triple={triple} accessKey={accessKey} />
      </Stack>
    </Stack>
  );
}
