import { RDFResource } from "../types/triple";

function saveAs(blob: Blob, fileName: string, document: any): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function downloadTripleFile({
  triples,
  fileName,
  document,
}: {
  triples: RDFResource[];
  fileName: string;
  document: any;
}): void {
  const triplesJson = JSON.stringify(triples, null, 2);
  const blob = new Blob([triplesJson], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `${fileName}.json`, document);
}
