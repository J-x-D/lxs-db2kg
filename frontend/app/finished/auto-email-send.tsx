"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Link, Stack, TextField, Typography } from "@mui/material";
import { sendEmail } from "./send-email";
import { LoadingButton } from "@mui/lab";
import { Check, EmailOutlined } from "@mui/icons-material";
import { useStore } from "store/store";

export type FormData = z.infer<typeof formSchema>;

export type Response =
  | {
      success: true;
    }
  | {
      success: false;
      error?: string;
    };

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Please enter your full name." })
      .min(2, { message: "Please enter at least two characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    store: z.any(),
  })
  .superRefine((data, ctx) => {
    const excludedFullNames = ["luca félix"];
    const excludedEmails = ["luca.ziegler.felix@gmail.com"];

    if (
      excludedFullNames.some((word) =>
        data.fullName.toLowerCase().includes(word),
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_string,
        validation: "ip",
        message: "Please use your own name.",
        path: ["fullName"],
      });
    }

    if (excludedEmails.includes(data.email.toLowerCase())) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_string,
        validation: "email",
        message: "Please use your own email address.",
        path: ["email"],
      });
    }

    return true;
  });

interface ContactFormProps {
  page?: string;
}

export function AutoEmailSend({ page }: ContactFormProps) {
  const store = useStore();

  const [status, setStatus] = React.useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      store: store,
    },
  });

  async function onSubmit(values: FormData) {
    setStatus("pending");

    sendEmail(values)
      .then((res) => {
        if (res.success !== true) throw res.error;
        setStatus("success");
        store.setAlert({
          open: true,
          message: "Email sent successfully!",
          type: "success",
          duration: 6000,
        });
        form.reset();
        setTimeout(() => setStatus("idle"), 5000);
      })
      .catch((e: unknown) => {
        const error = e as string;
        setStatus("error");
        console.log(error);
        setErrorMessage(error);
        setTimeout(() => setStatus("idle"), 5000);
      });
  }

  return (
    <form {...form} onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={"space-between"}
          gap={1}
        >
          <Typography variant="h5">Send your triples</Typography>
          <Link
            href={`mailto:${process.env.NEXT_PUBLIC_MY_EMAIL}?subject=Results from ${page}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <EmailOutlined fontSize={"inherit"} />I would prefer to send the
            results myself.
          </Link>
        </Stack>
        <Typography variant="body1">
          Please enter your full name and email address so we can check your
          results. This will automatically send me an email with your results
          attached.
        </Typography>
        <Stack
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          <TextField
            {...form.register("fullName")}
            label="Your name"
            disabled={status === "pending"}
            error={!!form.formState.errors.fullName}
            helperText={form.formState.errors.fullName?.message?.toString()}
          />
          <TextField
            {...form.register("email")}
            label="Your email-address"
            disabled={status === "pending"}
            error={!!form.formState.errors.email}
            helperText={form.formState.errors.email?.message?.toString()}
          />
        </Stack>

        <LoadingButton
          variant="contained"
          type="submit"
          sx={{
            height: "36.5px",
          }}
          disabled={
            status === "pending" || status === "success" || status === "error"
          }
          loading={status === "pending"}
          color={
            status === "success"
              ? "success"
              : status === "error"
                ? "error"
                : "primary"
          }
        >
          {status === "success" && (
            <>
              <Check />
              Message sent!
            </>
          )}
          {(status === "idle" || status === "error") && "Send My Results"}
        </LoadingButton>
        {status === "error" && (
          <Typography color="error">
            {errorMessage ||
              "An error occured while sending your message. Please try again later."}
          </Typography>
        )}
        {status === "success" && (
          <Typography>
            Your results have been sent successfully! 🎉
          </Typography>
        )}
      </Stack>
    </form>
  );
}
