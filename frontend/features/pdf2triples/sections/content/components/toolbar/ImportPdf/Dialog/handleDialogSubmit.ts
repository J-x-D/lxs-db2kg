import getPDFContents from "features/pdf2triples/utils/pdfExtractText";
import { FieldValues } from "react-hook-form";
import { ExtractedTextResponse } from "../../../../types/pdfResponse";
import { cleanPdfText } from "features/pdf2triples/utils/cleanPdfText";
import getDissolvedCoreferences from "features/pdf2triples/utils/getDissolvedCoreferences";

export async function handleSubmitImportPdfDialog(
  data: FieldValues
): Promise<ExtractedTextResponse> {
  const { response: extractedPdf, error: extractedPdfError } =
    await getPDFContents({
      pdfFilePath: data.url,
    });

  if (extractedPdfError || !extractedPdf) {
    return { text: "", error: extractedPdfError?.message ?? "Invalid PDF" };
  }
  const text = cleanPdfText(
    extractedPdf.Pages.reduce((acc, page) => {
      return (
        acc +
        page.Texts.reduce((acc, text) => {
          return acc + decodeURIComponent(text.R[0].T) + " ";
        }, " ")
      );
    }, " ")
  );

  const { response: dissolvedText, error: dissolvedError } = await getDissolvedCoreferences(text);

  if (dissolvedError) {
    return { text: "", error: dissolvedError };
  }

  return {
    title: extractedPdf.Meta.Title,
    text: dissolvedText || text,
  };
}
