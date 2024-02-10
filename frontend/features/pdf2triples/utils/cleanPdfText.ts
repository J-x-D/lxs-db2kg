export function cleanPdfText(pdfText: string): string {
  let outputText = replaceMultipleSpacesWithOne(pdfText);
  outputText = replaceNewLinesWithSpaces(outputText);
  return outputText;
}

const replaceMultipleSpacesWithOne = (inputString: string): string =>
  inputString.replace(/\s+/gm, " ");

const replaceNewLinesWithSpaces = (inputString: string): string =>
  inputString.replace(/(\r\n|\n|\r)/gm, " ");
