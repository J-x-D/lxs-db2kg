export const shouldUseOntology = ({
  ontologyUrls,
  pdf2triplesGenerateBasedOntology,
}: {
  ontologyUrls: (string | undefined)[];
  pdf2triplesGenerateBasedOntology: boolean;
}) => {
  const hasImportedAnyOntologies = ontologyUrls.length > 0;
  return hasImportedAnyOntologies && pdf2triplesGenerateBasedOntology;
};
