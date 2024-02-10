import { NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: {
    query: {
      prefix: string;
      predicate: string;
    };
  },
  res: NextApiResponse
) {
  const { prefix, predicate } = req.query;

  const lovUrl = `https://lov.linkeddata.es/dataset/lov/api/v2/term/search?q=${predicate}&type=property&vocab=${prefix}`;

  const suggestions = await axios
    .get(lovUrl)
    .then((response) => response.data.results)
    .catch((error) => {
      console.error(error);
      return [];
    });

  const isMatch = suggestions.some(
    (suggestion: {
      prefixedName: string[];
      localName: string;
      score: number;
      type: string;
      uri: string[];
    }) => suggestion.prefixedName.includes(`${prefix}:${predicate}`)
  );

  return res.status(200).json({ isMatch, predicate });
}
