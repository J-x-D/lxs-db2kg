import React from "react";
import BaseToggleSwitch from "../../BaseToggleSwitch";
import { useStore } from "store/store";
import { FindInPage, FindInPageOutlined } from "@mui/icons-material";

export default function ShowPaginationToggleSwitch() {
  const { showTablePagination, setShowTablePagination } = useStore();
  return (
    <BaseToggleSwitch
      state={showTablePagination}
      setState={setShowTablePagination}
      title={"Show Table Pagination"}
      description={
        "Enables the pagination of the tables. This can be especially useful when you have a lot of data."
      }
      icon={<FindInPage sx={{ color: "grey" }} />}
      iconOn={<FindInPageOutlined color="primary" />}
    />
  );
}
