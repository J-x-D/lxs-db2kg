import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@mui/material";
import { DefaultActions } from "./Default";
import { estimateTimeRemaining } from "../../../../utils/estimateTimeRemaining";
import { ExtractedTextResponse } from "features/pdf2triples/sections/content/types/pdfResponse";

function Progress(
  props: LinearProgressProps & {
    label: string;
    time: number;
  },
) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Box
        component="div"
        display={"flex"}
        alignItems="center"
        width="100%"
        justifyContent={"space-between"}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {props.label}
        </Typography>
        {props.time && props.time > 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {"About "}
            {props.time}
            {" second"}
            {props.time === 1 ? "" : "s"} {"remaining"}
          </Typography>
        )}
      </Box>
      <Box component="div" sx={{ width: "100%" }}>
        <LinearProgress {...props} />
      </Box>
    </Box>
  );
}

export default function Loading({
  textSent,
}: {
  textSent: ExtractedTextResponse;
}) {
  const [timeRemaining, setTimeRemaining] = React.useState<number>(
    estimateTimeRemaining(textSent.text.length),
  );

  useEffect(() => {
    setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
  }, []);

  const val =
    100 -
    (timeRemaining / estimateTimeRemaining(textSent.text.length) + 30) * 100; // 30 seconds buffer

  if (val <= 0) return <LinearProgress />;

  return (
    <>
      <Progress
        label={"Calling Artificial Intelligence"}
        time={Math.round(timeRemaining)}
        variant="determinate"
        value={val}
      />
    </>
  );
}

export function LoadingActions({
  handleClose,
  handleSubmit,
}: {
  handleClose: () => void;
  handleSubmit: () => void;
}) {
  return (
    <DefaultActions
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      status={{ value: "loading" }}
    />
  );
}
