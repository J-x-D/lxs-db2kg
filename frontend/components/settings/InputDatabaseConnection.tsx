import React from "react";
import CustomTextField from "../ui-components/CustomTextField";

export default function InputDatabaseConnection() {
  const [value, setValue] = React.useState("");

  return <CustomTextField label="Database Connection String" value={value} setValue={setValue} />;
}
