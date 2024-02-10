import React from "react";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";
import EditSPOSubPage from "../../../editTriple/EditSPOSubPage";
import { RDFResource } from "features/pdf2triples/types/triple";

export default function AddObject({
  triple,
  setValue,
  value,
}: {
  triple: RDFResource;
  setValue?: (label?: string, newClass?: string) => void;
  value?: string;
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
            The object is the entity that is described. Even though only the
            value is required, it is recommended to also add a class and the
            words that match the object in the text.
          </>
        }
      />
      <EditSPOSubPage
        accessKey="object"
        setValue={setValue}
        triple={triple}
        value={value}
      />
    </div>
  );
}
