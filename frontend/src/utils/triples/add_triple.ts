import { RmlRule } from "types/RmlRulesTypes";
import axios from "axios";

interface AddTripleProps {
  triple: {
    predicate: string;
    reference?: string;
    join?: {
      child: string;
      parentTriplesMap: string;
    };
  };
  rmlRule: RmlRule[];
}

export default async function addTriple({ triple, rmlRule }: AddTripleProps) {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/add_triple";
  const data = {
    triple,
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
      console.error("add triple error", err);
      return err;
    });
  return response;
}
