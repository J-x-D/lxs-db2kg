import * as React from "react";
import Stack from "@mui/material/Stack";
import ToolbarGroup from "./ToolbarGroup";
import DeleteToggleButton from "./ToggleButtons/DeleteToggleButton";
import ViewToggleButton from "./ToggleButtons/ViewToggleButton";
import AutoGenToggleButton from "./ToggleButtons/AutoGenToggleButton";
import EditAndCreateToggleButton from "../EditAndCreateToggleButton/EditAndCreateToggleButton";
import OrientationToggleButton from "./ToggleButtons/OrientationToggleButton";
import { useStore } from "store/store";

/* assing new type of element */
type elementType = {
  name: string;
  element?: JSX.Element;
  tooltip?: string;
  disabled?: boolean;
  label?: string;
};

export default function CustomToolbar(): JSX.Element {
  const { advancedMode, setTablesOrientation } = useStore();

  return (
    <Stack display={"flex"} flexDirection={"row"} alignItems="center" gap={2}>
      {advancedMode && (
        <ToolbarGroup>
          <OrientationToggleButton />
        </ToolbarGroup>
      )}
      <ToolbarGroup>
        <DeleteToggleButton />
      </ToolbarGroup>
      <ToolbarGroup>
        <EditAndCreateToggleButton isInToolbar />
        <ViewToggleButton />
      </ToolbarGroup>
      <ToolbarGroup>
        <AutoGenToggleButton />
      </ToolbarGroup>
    </Stack>
  );
}
