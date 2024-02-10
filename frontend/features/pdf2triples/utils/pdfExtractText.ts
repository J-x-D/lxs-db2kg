import axios, { AxiosError } from "axios";
import { Output } from "pdf2json";

export default async function getPDFContents(options: { pdfFilePath: string }) {
  try {
    const response = await axios.get("/api/process-pdf", {
      method: "GET",
      params: {
        uri: encodeURI(options.pdfFilePath),
      },
    });
    return {
      response: response.data as Output,
      error: undefined,
    };
  } catch (err) {
    return { error: err, response: undefined } as {
      error: AxiosError;
      response: Output | undefined;
    };
  }
}
