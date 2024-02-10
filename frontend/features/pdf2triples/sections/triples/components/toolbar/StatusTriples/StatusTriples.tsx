import React, { useEffect, useState } from "react";
import { useStore } from "store/store";
import { TriplesCheckStatus, checkTriplesStatus } from "./checkTriplesStatus";
import ToggleButtonBase from "components/ui-components/CustomToolbar/ToggleButtonBase";
import ToolbarGroup from "components/ui-components/CustomToolbar/ToolbarGroup";

import { Check, Clear, Loop } from "@mui/icons-material";

export default function StatusTriples() {
  const { rdfResources } = useStore();
  const [triplesCheckStatus, setTriplesCheckStatus] =
    useState<TriplesCheckStatus>({
      status: "hidden",
    });

  useEffect(() => {
    recheckTriples();
  }, [rdfResources]);

  const checkTripleStatus = () =>
    setTriplesCheckStatus(checkTriplesStatus(rdfResources));

  // fake loading
  const recheckTriples = () => {
    setTriplesCheckStatus({ status: "loading" });
    setTimeout(() => {
      checkTripleStatus();
    }, 500);
  };

  const statusIcon = (key: "success" | "error" | "loading") => {
    return {
      success: <Check color="success" />,
      error: <Clear color="error" />,
      loading: <Loop />,
    }[key];
  };

  const statusMessage = (key: "success" | "error" | "loading") => {
    return {
      success: "Triples are valid",
      error: "Triples are invalid",
      loading: "Checking triples...",
    }[key];
  };

  if (triplesCheckStatus.status === "hidden") return <></>;

  return (
    <ToolbarGroup minWidth="42px" height="42px">
      <ToggleButtonBase
        width="300px"
        element={statusIcon(triplesCheckStatus.status)}
        label={
          triplesCheckStatus?.tooltipLabel ||
          statusMessage(triplesCheckStatus.status)
        }
        handleButtonClick={recheckTriples}
        tooltipLabel={"Click to recheck"}
      />
    </ToolbarGroup>
  );
}
