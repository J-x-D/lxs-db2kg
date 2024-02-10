import { TextTriple } from "features/pdf2triples/sections/content/types/content";
import { RDFResource } from "features/pdf2triples/types/triple";
import axios from "axios";

interface Response {
  triples: RDFResource[];

  error?: {
    message: string;
  };
}

export async function handleGenerateTriples(prompt: string | undefined) {
  try {
    if (!prompt) {
      console.log("Prompt is empty");
      throw new Error("Prompt is empty");
    }
    const response: { data: TextTriple[] } = await axios({
      method: "post",
      timeout: 1000 * 60 * 5, // 5 minutes
      url: process.env.NEXT_PUBLIC_BACKEND_URL + "/execute",
      data: {
        prompt,
        serialize: true
      },
    }).catch((error) => {
      throw error;
    });
    return {
      triples: response.data as unknown as RDFResource[]
    }
  } catch (error) {
    console.error(error);
    const axiosError = error as any;
    const statusCode = axiosError?.response?.status;
    const errorMessage = axiosError?.response?.data?.Error;
    const message = `Error ${statusCode}: ${errorMessage ?? "Unknown error"}`;
    return {
      error: {
        message,
      },
    } as Response;
  }
}
