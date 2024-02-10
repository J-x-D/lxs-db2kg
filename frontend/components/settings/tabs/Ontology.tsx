import React from "react";
import OntologiesList from "../ontologies/OntologiesList";

interface OntologySettingsProps {
  ontologiesStore: string[];
  setOntologiesStore: (ontologies: string[]) => void;
}

export default function Ontology({ ontologiesStore, setOntologiesStore }: OntologySettingsProps) {
  return <OntologiesList />;
}
