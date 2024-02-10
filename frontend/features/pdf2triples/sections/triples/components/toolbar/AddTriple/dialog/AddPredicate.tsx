import React from "react";
import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";
import EditSPOSubPage from "../../../editTriple/EditSPOSubPage";
import { RDFResource } from "features/pdf2triples/types/triple";

export default function AddPredicate({
  triple,
  setValue,
  value,
}: {
  triple: RDFResource;
  setValue: (triple?: string, property?: string) => void;
  value?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <GuidanceInfoAlert
        text={
          <>
            The predicate is the property of the subject. For example, if the
            subject is a person, the predicate could be &quot;has name&quot;.
            Even though only the value is required, it is recommended to also
            add a property and the words that match the predicate in the text.
          </>
        }
      />
      <EditSPOSubPage
        accessKey="predicate"
        setValue={setValue}
        triple={triple}
        value={value}
      />
    </div>
  );
}
