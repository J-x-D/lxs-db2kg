import React from "react";
import ToggleButtonBase from "../ToggleButtonBase";


import { useStore } from "store/store";
import {
  HorizontalSplitOutlined,
  VerticalSplitOutlined,
} from "@mui/icons-material";

export default function OrientationToggleButton() {
  const { tablesOrientation, setTablesOrientation } = useStore();

  function handleOrientationButtonClick() {
    setTablesOrientation(
      tablesOrientation === "vertical" ? "horizontal" : "vertical"
    );
  }
  return (
    <>
      <ToggleButtonBase
        element={
          tablesOrientation !== "horizontal" ? (
            <HorizontalSplitOutlined />
          ) : (
            <VerticalSplitOutlined />
          )
        }
        value="view-orientation"
        handleButtonClick={() => handleOrientationButtonClick()}
        tooltipLabel={
          tablesOrientation === "vertical"
            ? "Switch to horizontal view"
            : "Switch to vertical view"
        }
      />
    </>
  );
}
