import { Stack, Typography } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number | string;
  value: number | string;
  header: string | React.ReactNode;
}

export default function TabPanel({ children, index, value, header, ...other }: TabPanelProps) {
  return (
    <Stack
      spacing={3}
      sx={{ paddingTop: 3, gap: 10 }}
      role="tabpanel"
      hidden={value !== index} /* hide if is not current tab */
      display={value === index ? "block" : "none"}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index ? (
        typeof header === "string" ? (
          <>
            <Typography variant="h5">{header}</Typography>
            {children}
          </>
        ) : (
          <>
            {header}
            {children}
          </>
        )
      ) : null}
    </Stack>
  );
}
