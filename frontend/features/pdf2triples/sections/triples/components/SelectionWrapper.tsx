"use client";
import React, { useEffect } from "react";
import { useStore } from "store/store";
import { userSelectionToWords } from "../../content/utils/rendering/userSelectionToWords";

export default function SelectionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    setPdf2triplesLxsSelectedText,
    pdf2triplesGlobalPdf,
    pdf2triplesLxsTextOutlineColor,
    setPdf2triplesLxsTextOutlineColor,
  } = useStore();

  const searchSelectedWords = () => {
    const newSelectedWords = userSelectionToWords(
      pdf2triplesGlobalPdf?.text ?? "",
    );
    if (!newSelectedWords) return;
    setPdf2triplesLxsSelectedText(newSelectedWords);
  };

  useEffect(() => {
    const contentElement = document.getElementById("content");

    if (pdf2triplesLxsTextOutlineColor) {
      contentElement?.addEventListener("mouseup", searchSelectedWords);
    } else {
      contentElement?.removeEventListener("mouseup", searchSelectedWords);
    }

    return () => {
      contentElement?.removeEventListener("mouseup", searchSelectedWords);
    };
  }, [pdf2triplesLxsTextOutlineColor]);

  return <>{children}</>;
}
