import { RmlRule } from "types/RmlRulesTypes";
import axios from "axios";

interface EditTripleProps {
  new_triple: {
    subject: string;
    predicate: string;
    reference?: string;
    join?: {
      child: string;
      parentTriplesMap: string;
    };
  };
  old_triple: {
    subject: string;
    predicate: string;
    object: string;
  };
  rmlRule: RmlRule[];
}

export default async function editTriple({
  new_triple,
  old_triple,
  rmlRule,
}: EditTripleProps) {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/update_triple"; // changed from edit_triple to update_triple
  const data = {
    new_triple,
    old_triple,
    rml_rule: rmlRule,
  };

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
      console.error("edit triple error", err);
      return err;
    });
  return response;
}
