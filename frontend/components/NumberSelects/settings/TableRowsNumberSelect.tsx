import React from "react";

import { useStore } from "store/store";
import {
  TableRowsOutlined,
} from "@mui/icons-material";
import BaseNumberSelect from "../BaseNumberSelect";

export default function TableRowsNumberSelect() {
  const { tableRows, setTableRows } = useStore();
  return (
    <BaseNumberSelect
      state={tableRows}
      setState={setTableRows}
      title={"Default Rows in Tables"}
      description={
        <>
          The number of rows to show in the tables by default. This can be
          changed in the table settings.
        </>
      }
      icon={
        <TableRowsOutlined
          sx={{
            color: "grey",
          }}
        />
      }
    />
  );
}
