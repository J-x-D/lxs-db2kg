"use client";
import React from "react";
import "styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@emotion/react";
import theme from "src/theme";

import AlertSnackbar from "./alert-snackbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function layout(pageProps: LayoutProps) {
  const { children } = pageProps;

  return (
    <html lang="en">
      <head>
        <title>LXS Application</title>
      </head>
      <ThemeProvider theme={theme}>
        <body>
          {children}
          <AlertSnackbar />
        </body>
      </ThemeProvider>
    </html>
  );
}
