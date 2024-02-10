import React from "react";
import BaseToggleSwitch from "../../BaseToggleSwitch";
import { useStore } from "store/store";
import {
  TipsAndUpdates,
  TipsAndUpdatesOutlined,
} from "@mui/icons-material";

export default function ShowGuidanceToggleSwitch() {
  const { showGuidance, setShowGuidance } = useStore();
  return (
    <BaseToggleSwitch
      state={showGuidance}
      setState={setShowGuidance}
      title={"Show Guidance"}
      description={
        "Enables some small helper texts to guide you through the application"
      }
      icon={<TipsAndUpdates sx={{ color: "grey" }} />}
      iconOn={<TipsAndUpdatesOutlined color="primary" />}
    />
  );
}
