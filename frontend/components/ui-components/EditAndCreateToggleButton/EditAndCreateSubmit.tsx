import addTriple from "src/utils/triples/add_triple";
import editTriple from "src/utils/triples/edit_triple";
import { useStore } from "store/store";
import { Triples } from "types/Triples";
import React from "react";
import { LoadingButton } from "@mui/lab";

export default function EditAndCreateSubmit({
  objectTarget,
  oldTriple,
  newTriple,
  isEditMode,
  setError,
  callBackFn,
  checkRequiredFields,
}: {
  objectTarget: string;
  oldTriple: Triples;
  newTriple: Triples;
  isEditMode: boolean;
  setError: (error: string) => void;
  callBackFn: () => void;
  checkRequiredFields: () => boolean;
}) {
  const { setAlert, schema, rmlRules, selectedTable, setRmlRules } = useStore();
  const [loading, setLoading] = React.useState(false);

  const parentTriplesMap = `${schema}_${newTriple.table}_TriplesMap`;

  const handleCreateTriple = async () => {
    const response = await addTriple({
      triple: {
        predicate: newTriple.predicate,
        reference: objectTarget === "column" ? newTriple.object : undefined,
        join:
          objectTarget === "table"
            ? {
                parentTriplesMap: parentTriplesMap,
                child: newTriple.object,
              }
            : undefined,
      },
      rmlRule: rmlRules[selectedTable],
    });
    if (response.status === 200) {
      setRmlRules(selectedTable, response.data);
      setAlert({
        open: true,
        message: "Triple created successfully",
        type: "success",
      });
      callBackFn();
    } else {
      const errorMsg = response.message ?? "Unknown error";
      setError(errorMsg);
      setAlert({
        open: true,
        message: errorMsg,
        type: "error",
      });
    }
  };

  const handleEditTriple = async () => {
    const response = await editTriple({
      new_triple: {
        subject: newTriple.subject,
        predicate: newTriple.predicate,
        reference: objectTarget === "column" ? newTriple.object : undefined,
        join:
          objectTarget === "table"
            ? {
                parentTriplesMap: parentTriplesMap,
                child: newTriple.object,
              }
            : undefined,
      },
      old_triple: {
        subject: oldTriple.subject,
        predicate: oldTriple.predicate,
        object: oldTriple.object,
      },
      rmlRule: rmlRules[selectedTable],
    });

    if (response.status === 200) {
      setAlert({
        open: true,
        message: "Triple edited successfully",
        type: "success",
      });
      callBackFn();
    } else {
      const errorMsg = response.message ?? "Unknown error";
      setError(errorMsg);
      setAlert({
        open: true,
        message: errorMsg,
        type: "error",
      });
    }
  };

  const submit = async () => {
    if (checkRequiredFields()) {
      return;
    }
    setLoading(true);
    if (isEditMode) {
      await handleEditTriple();
    } else {
      await handleCreateTriple();
    }
    setLoading(false);
  };
  return (
    <LoadingButton
      loading={loading}
      onClick={() => submit()}
      variant="contained"
    >
      Save
    </LoadingButton>
  );
}
