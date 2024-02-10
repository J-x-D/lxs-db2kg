import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import { GridCloseIcon } from "@mui/x-data-grid";
import { z } from "zod";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { ExtractedTextResponse } from "features/pdf2triples/sections/content/types/pdfResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_TOKENS } from "../../../../../../../triples/utils/checks/isTooManyTokens";


const validationSchema = z.object({
  text: z.string().min(1).max(MAX_TOKENS, "Too many tokens. Try shortening the text."),
});

type FormData = z.infer<typeof validationSchema>;

export default function ImportTextString({
  handleClose,
  handleNext,
}: {
  handleClose: () => void;
  handleNext: (formData: ExtractedTextResponse, source: string) => void;
}) {
  const {
    formState: { errors, isLoading, isSubmitting, isDirty },
    setValue,
    watch,
    register,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const sendData = async (data: FieldValues) => {
    handleNext(
      {
        text: data.text,
        title: "Text Input",
      },
      "string",
    );
  };

  const resetText = () => setValue("text", "");

  return (
    <form onSubmit={handleSubmit(sendData)}>
      <FormControl fullWidth onSubmit={handleSubmit(sendData)}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: 0,
          }}
        >
          <DialogContentText>
            Please enter some text to generate the triples from.
          </DialogContentText>

          <FormControl
            fullWidth
            variant="outlined"
            required
            error={!!errors.text}
          >
            <InputLabel htmlFor="text-input" shrink={!!watch("text")}>
              Text
            </InputLabel>
            <OutlinedInput
              autoFocus
              multiline
              minRows={5}
              maxRows={10}
              id="text-input"
              notched={!!watch("text")}
              label="Text"
              {...register("text", { required: true })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton>
                    {watch("text") && <GridCloseIcon onClick={resetText} />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>
              {errors.text?.type === "string.empty"
                ? "Please enter some text"
                : errors.text
                  ? errors.text.message ?? "Invalid text"
                  : " "}
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            variant="contained"
            loading={isLoading || isSubmitting}
            onClick={handleSubmit(sendData)}
            disabled={!!errors.text}
          >
            Next
          </LoadingButton>
        </DialogActions>
      </FormControl>
    </form>
  );
}
