import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ExtractedTextResponse } from "features/pdf2triples/sections/content/types/pdfResponse";
import { correctGeneratedTriples } from "features/pdf2triples/utils/correctGeneratedTriples";

export type GenerateTriplesResponse = {
  head: string;
  type: string;
  tail: string;
  meta: {
    spans: [number, number][];
  };
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const {
    pdf,
    predicate_options,
  }: {
    pdf: ExtractedTextResponse;
    predicate_options: string[] | undefined;
  } = req.body;

  const user_input = pdf.text;

  if (req.method !== "POST") {
    return res.status(400).json({ message: "Only POST requests allowed" });
  }

  if (!user_input) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  if (user_input.length > 6000) {
    return res.status(400).json({
      message:
        "Exceeded max tokens. Please shorten the pdf or only generate a portion of it.",
    });
  }

  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  // http://0.0.0.0:8000/is_backend_running this path return 200 if backend is running, check if it is running timeout after 1 second
  try {
    await axios.get(url + "/is_backend_running");
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      res.status(500).json({
        message:
          "The backend is not running. Please start the backend and try again.",
      });
    }
  }

  const response = await axios.post(
    url + "/pdf_create_triples",
    { user_input, predicate_options: predicate_options },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      timeout: 1000 * 60 * 5, // Wait 5 minutes
      timeoutErrorMessage: "The request took too long. Please try again.",
    },
  );

  try {
    // if (
    //   response?.data?.triples === undefined ||
    //   response.data.triples.length === 0
    // ) {
    //   res
    //     .status(500)
    //     .json({ message: "We couldn't generate Triples. Please try again." });
    // }
    const triples = correctGeneratedTriples(response.data.triples);
    if (!triples || triples?.length === 0) {
      res.status(500).json({
        message: "The generated Triples weren't valid. Please try again.",
      });
    }

    return res.status(200).json(triples);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
}
