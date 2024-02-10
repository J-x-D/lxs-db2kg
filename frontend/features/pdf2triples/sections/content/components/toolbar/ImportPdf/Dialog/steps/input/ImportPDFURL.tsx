import React from "react";
import {
  DialogContentText,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { handleSubmitImportPdfDialog } from "../../handleDialogSubmit";
import StepperInputActions from "./Actions";
import { ExtractedTextResponse } from "features/pdf2triples/sections/content/types/pdfResponse";
import { MAX_TOKENS } from "features/pdf2triples/sections/triples/utils/checks/isTooManyTokens";

const formDataSchema = z.object({
  url: z
    .string()
    .url()
    .min(1)
    .max(MAX_TOKENS, "Too many tokens. Try shortening the text."),
});

type FormData = z.infer<typeof formDataSchema>;
export default function ImportPDFURL({
  handleNext,
  handleClose,
}: {
  handleNext: (
    formData: ExtractedTextResponse,
    source: FormData["url"],
  ) => void;
  handleClose: () => void;
}) {
  const {
    register,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
    clearErrors,
    reset,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const sendData: SubmitHandler<FormData> = async (data) => {
    const pdf = await handleSubmitImportPdfDialog(data);
    if (pdf?.error || !pdf.text) {
      console.error(pdf.error);
      control.setError("url", { message: "Invalid PDF" });
      return;
    }

    if (pdf.text.length > MAX_TOKENS) {
      control.setError("url", {
        message: "Too many tokens. Import a different PDF.",
      });
      return;
    }
    reset();
    handleNext(pdf, data.url);
  };

  const resetUrl = () => setValue("url", "");

  return (
    <form onSubmit={handleSubmit(sendData)}>
      <FormControl fullWidth onSubmit={handleSubmit(sendData)}>
        <Stack gap={1} pb={0}>
          <DialogContentText>
            Please enter the URL of the PDF you want to import or upload a PDF
            file.
          </DialogContentText>

          <FormControl
            fullWidth
            variant="outlined"
            required
            error={!!errors.url}
          >
            <InputLabel htmlFor="url-input" shrink={!!watch("url")}>
              URL
            </InputLabel>
            <OutlinedInput
              id="url-input"
              autoFocus
              notched={!!watch("url")}
              label="URL"
              {...register("url", { required: true })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton>
                    {watch("url") && <GridCloseIcon onClick={resetUrl} />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>
              {errors.url ? errors.url.message ?? "Invalid URL" : " "}
            </FormHelperText>
          </FormControl>
          <StepperInputActions
            handleClose={handleClose}
            handleNext={handleSubmit(sendData)}
            isLoading={isSubmitting}
            nextDisabled={!!errors.url}
          />
        </Stack>
      </FormControl>
    </form>
  );
}
