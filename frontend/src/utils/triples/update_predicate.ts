import { RmlRule } from "types/RmlRulesTypes";
import axios from "axios";
import addTriple from "./add_triple";

interface UpdatePredicateProps {
  rmlRule: RmlRule[];
  old_predicate?: string;
  predicate?: string;
  backup?: {
    subject: string;
    reference: string;
  };
}

export default async function updatePredicate({
  rmlRule,
  old_predicate,
  predicate,
  backup,
}: UpdatePredicateProps) {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/update_predicate";
  const data = {
    predicate,
    old_predicate,
    rml_rule: rmlRule,
  };

  if (!predicate?.includes('#')) {
    data.predicate = predicate?.replace('.owl', '.owl#');
  }

  if (old_predicate === "") {
    if (!!backup?.reference && !!backup?.subject) {
      const response = await addTriple({
        triple: {
          predicate: predicate || "",
          reference: backup.reference,
        },
        rmlRule,
      })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.error("add predicate error", err);
          return err;
        });
      return response;
    } else {
      return alert("Error: Subject and Reference are undefined");
    }
  }

  const response = await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error("update predicate error", err);
      return err;
    });
  return response;
}
