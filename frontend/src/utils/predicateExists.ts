import axios from "axios";

export default async function predicateExists({
  predicate,
}: {
  predicate?: string;
}) {
  axios
    .get(predicate || "", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log("error", error);
    });

  return;
}
