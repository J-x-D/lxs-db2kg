import React, { useEffect, useState } from "react";
import PreviewTriplesButton from "./PreviewTriplesButton";
import { useStore } from "store/store";
import PreviewTriplesSheet from "./PreviewTriplesSheet";

export default function PreviewTriples() {
  const { rdfResources, setSelectedRDFResource } = useStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) setSelectedRDFResource(undefined);

    return () => {};
  }, [open]);

  return (
    <div>
      <PreviewTriplesButton
        open={open}
        setOpen={setOpen}
        disabled={!rdfResources?.length}
      />
      <PreviewTriplesSheet open={open} setOpen={setOpen} />
    </div>
  );
}
