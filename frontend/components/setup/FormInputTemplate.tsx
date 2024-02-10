import { Box, FormControl, TextField, Typography } from "@mui/material";
import TestConnectionButton from "./TestConnectionButton";

export default function FormInputTemplate({
  disabled = false,
  fullWidth = true,
  heading,
  caption,
  helperText = " ",
  placeholder,
  value = " ",
  setValue,
  error = "",
  testAction = false,
  onTestClick,
  statusConnection,
  setStatusConnection = () => {},
  isValidUrl = () => true,
}: {
  disabled?: boolean;
  fullWidth?: boolean;
  heading?: string;
  caption?: string;
  helperText: string;
  placeholder?: string;
  value: string;
  setValue: Function;
  error?: string;
  testAction?: boolean;
  onTestClick?: any;
  statusConnection?: any;
  setStatusConnection?: any;
  isValidUrl?: Function;
}) {
  return (
    <FormControl id="form-upload-ontologies" sx={{ gap: 2 }}>
      {heading && <Typography variant="h5">{heading}</Typography>}
      {caption && <Typography variant="caption">{caption}</Typography>}
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <TextField
          label={helperText || " "}
          required={true}
          variant="outlined"
          value={value || " "}
          fullWidth={fullWidth}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            setStatusConnection((prevState: any) => ({
              ...prevState,
              connectionTested: false,
            }));
          }}
          error={error !== ""}
          helperText={error}
        />
        {testAction && (
          <TestConnectionButton
            disabled={!isValidUrl(value)}
            onClick={onTestClick}
          />
        )}
      </Box>
    </FormControl>
  );
}
