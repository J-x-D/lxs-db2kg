import React from "react";
import BaseToggleSwitch from "../../BaseToggleSwitch";
import { useStore } from "store/store";
import { Science, ScienceOutlined } from "@mui/icons-material";

export default function AdvancedModeToggleSwitch() {
  const { advancedMode, setAdvancedMode } = useStore();
  return (
    <BaseToggleSwitch
      state={advancedMode}
      setState={setAdvancedMode}
      title={"Advanced Mode"}
      description={
        <>
          Enable advanced mode to access more features such as the option for
          table pagination and configuring the application layout.
          <br /> Also allows you to create your own custom ontologies
        </>
      }
      icon={
        <Science
          sx={{
            color: "grey",
          }}
        />
      }
      iconOn={<ScienceOutlined color="primary" />}
    />
  );
}
