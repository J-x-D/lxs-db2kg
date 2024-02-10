import React from "react";
import WordsInput from "../../../../WordsInput";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";

export default function AddKnowledge({
  setKnowledge,
}: {
  setKnowledge: (knowledge: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <GuidanceInfoAlert
        title="Adding knowledge"
        text={
          <>
            Please add the knowledge for your triple. You can do so by selecting
            the text from the left-hand side. The text from the selection will
            be automatically extracted.
          </>
        }
      />
      <WordsInput setText={setKnowledge} generation />
    </div>
  );
}
