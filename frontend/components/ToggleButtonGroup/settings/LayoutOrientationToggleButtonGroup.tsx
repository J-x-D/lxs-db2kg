import React from "react";

import { useStore } from "store/store";
import {
  DashboardOutlined,
  HorizontalSplitOutlined,
  VerticalSplitOutlined,
} from "@mui/icons-material";
import BaseToggleButtonGroup from "../BaseToggleButtonGroup";
import { Stack } from "@mui/material";

export default function LayoutOrientationToggleButtonGroup() {
  const { tablesOrientation, setTablesOrientation } = useStore();

  const options = [
    {
      value: "vertical",
      label: (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          width={150}
          justifyContent={"center"}
        >
          <HorizontalSplitOutlined />
          Vertical
        </Stack>
      ),
    },
    {
      value: "horizontal",
      label: (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          width={150}
          justifyContent={"center"}
        >
          <VerticalSplitOutlined />
          Horizontal
        </Stack>
      ),
    },
  ];
  return (
    <BaseToggleButtonGroup
      state={tablesOrientation}
      setState={setTablesOrientation}
      options={options}
      title={"Orientation of Application"}
      description={
        <>
          The default orientation of the tables. This can also be changed inside
          the application.
        </>
      }
      icon={
        <DashboardOutlined
          sx={{
            color: "grey",
          }}
        />
      }
    />
  );
}
