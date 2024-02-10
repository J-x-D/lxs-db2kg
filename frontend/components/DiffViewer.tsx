import React from "react";
import { diffWords } from "diff";
import theme from "src/theme";

export default function DiffViewer({
  oldCode,
  newCode,
}: {
  oldCode: string;
  newCode: string;
}) {
  const differences = diffWords(oldCode, newCode, {
    ignoreCase: true,
    ignoreWhitespace: true,
  }).map((part, index) => {
    const color = part.added ? "green" : part.removed ? "red" : "grey";
    return (
      <span key={index} style={{ color }}>
        {part.value}
      </span>
    );
  });

  return (
    <div
      style={{
        height: "10rem",
        border: "1px solid #ccc",
        borderRadius: theme.shape.borderRadius + "px",
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        overflow: "auto",
      }}
    >
      {differences}
    </div>
  );
}
