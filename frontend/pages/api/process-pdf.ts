import { NextApiRequest, NextApiResponse } from "next";
import PDFParser from "pdf2json";
import axios from "axios";

export const config = {
  maxDuration: 5,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }
  if (!req.query.uri)
    return res.status(400).json({ statusCode: 400, message: "Missing uri" });

  try {
    const pdfUrl = req.query.uri as string;

    // Download the PDF file from the URL
    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const pdfBuffer = Buffer.from(response.data);

    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData: Error | { parserError: Error }) => {
      console.error(errData);
      return res
        .status(500)
        .json({ statusCode: 500, message: errData.toString() });
    });
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      return res.status(200).json(pdfData);
    });

    // Load the PDF from the buffer
    pdfParser.parseBuffer(pdfBuffer);
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: err ?? "Error processing PDF" });
  }
}
