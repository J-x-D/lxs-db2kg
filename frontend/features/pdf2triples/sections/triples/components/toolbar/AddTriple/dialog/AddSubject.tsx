import React from "react";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";
import EditSPOSubPage from "../../../editTriple/EditSPOSubPage";
import { RDFResource } from "features/pdf2triples/types/triple";

export default function AddSubject({
  value,
  triple,
  setValue,
}: {
  triple: RDFResource;
  value?: string;
  setValue: (label?: string, subjectClass?:string) => void;
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
        text={
          <>
            The subject is the entity that is described. Even though only the
            value is required, it is recommended to also add a class and the
            words that match the subject in the text.
          </>
        }
      />
      <EditSPOSubPage
        accessKey="subject"
        setValue={setValue}
        triple={triple}
        value={value}
        
      />
    </div>
  );
}
